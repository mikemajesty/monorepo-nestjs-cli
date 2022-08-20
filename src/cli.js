import arg from 'arg';
import fs from 'fs';
import { bold, green, red } from 'colorette';
const fse = require('fs-extra');
import path from 'path';
const { getController, getAdapter, getModule, getService, getSwagger } = require('./scafold/module');
const { getControllerTest, getModuleTest, getServiceTest } = require('./scafold/tests');
const { getJestConfig, getTsconfigBuild, getTsconfig, getPackage, getDockerFile, getDockerignore, getEslitignore, vsCode } = require('./scafold/app/root');
const { getTests } = require('./scafold/app/tests');
const { getMain, getSourceModule, health, healthTests } = require('./scafold/app/src');
const { exec } = require('child_process');
const cliSelect = require('cli-select');
const prompt = require('prompt-sync')();


const createMonorepoApp = async (name) => {
  if (!name) throw new Error('--name is required')
  name = name.toLowerCase()
  const dirRoot = `${__dirname}/scafold/templates/${name}-api`

  try {
    if (fs.existsSync(dirRoot)) {
      fs.rmSync(dirRoot, { recursive: true });
    }

    fs.mkdirSync(dirRoot)
    fs.writeFileSync(`${dirRoot}/.dockerignore`, getDockerignore(name))
    fs.writeFileSync(`${dirRoot}/.eslintignore`, getEslitignore(name))
    fs.writeFileSync(`${dirRoot}/jest.config.js`, getJestConfig())
    fs.writeFileSync(`${dirRoot}/Dockerfile`, getDockerFile(name))
    fs.writeFileSync(`${dirRoot}/package.json`, getPackage(name).replace(/''/g, '\''))
    fs.writeFileSync(`${dirRoot}/tsconfig.build.json`, getTsconfigBuild())
    fs.writeFileSync(`${dirRoot}/tsconfig.json`, getTsconfig(name))

    const dirVsCode = dirRoot + '/.vscode'

    if (fs.existsSync(dirVsCode)) {
      fs.rmSync(dirVsCode, { recursive: true });
    }

    fs.mkdirSync(dirVsCode)

    fs.writeFileSync(`${dirVsCode}/extensions.json`, vsCode(name).extensions)
    fs.writeFileSync(`${dirVsCode}/launch.json`, vsCode(name).launch.replace(/##/g, '$'))
    fs.writeFileSync(`${dirVsCode}/settings.json`, vsCode(name).settings)


    const dirTests = dirRoot + '/tests'

    if (fs.existsSync(dirTests)) {
      fs.rmSync(dirTests, { recursive: true });
    }

    fs.mkdirSync(dirTests)
    fs.writeFileSync(`${dirTests}/initialization.js`, getTests(name))

    const dirSrc = dirRoot + '/src'

    if (fs.existsSync(dirSrc)) {
      fs.rmSync(dirSrc, { recursive: true });
    }

    fs.mkdirSync(dirSrc)
    fs.writeFileSync(`${dirSrc}/main.ts`, getMain(name).replace(/##/g, '$').replace(/''/g, '`'))

    const dirModule = dirSrc + '/modules'

    if (fs.existsSync(dirModule)) {
      fs.rmSync(dirModule, { recursive: true });
    }

    fs.mkdirSync(dirModule)
    fs.writeFileSync(`${dirModule}/module.ts`, getSourceModule())


    const dirHealth = dirModule + '/health'

    if (fs.existsSync(dirHealth)) {
      fs.rmSync(dirHealth, { recursive: true });
    }

    fs.mkdirSync(dirHealth)

    fs.writeFileSync(`${dirHealth}/adapter.ts`, health(name).adapter)
    fs.writeFileSync(`${dirHealth}/controller.ts`, health(name).controller)
    fs.writeFileSync(`${dirHealth}/module.ts`, health(name).module)
    fs.writeFileSync(`${dirHealth}/service.ts`, health(name).service.replace(/##/g, '$').replace(/''/g, '`'))
    fs.writeFileSync(`${dirHealth}/swagger.ts`, health(name).swagger.replace(/##/g, '$').replace(/''/g, '`'))

    const dirHealthTests = dirHealth + '/__tests__'

    if (fs.existsSync(dirHealthTests)) {
      fs.rmSync(dirHealthTests, { recursive: true });
    }

    fs.mkdirSync(dirHealthTests)
    fs.writeFileSync(`${dirHealthTests}/controller.e2e.spec.ts`, healthTests(name).controller.replace(/##/g, '$').replace(/''/g, '`'))
    fs.writeFileSync(`${dirHealthTests}/service.spec.ts`, healthTests(name).service.replace(/##/g, '$').replace(/''/g, '`'))
    fs.writeFileSync(`${dirHealthTests}/module.spec.ts`, healthTests(name).module)

    return `${name}-api`
  } catch (error) {
    console.log('error', error)
    if (fs.existsSync(dirRoot)) {
      fs.rmSync(dirRoot, { recursive: true });
    }

    return `${name}-api`
  }

}

const createMonorepoModule = async (name) => {
  if (!name) throw new Error('--name is required')
  name = name.toLowerCase()
  const dir = `${__dirname}/scafold/templates/${name}`

  try {

    if (fs.existsSync(dir)) {
      fs.rmSync(dir, { recursive: true });
    }

    fs.mkdirSync(dir)
    fs.writeFileSync(`${dir}/controller.ts`, getController(name))
    fs.writeFileSync(`${dir}/adapter.ts`, getAdapter(name))
    fs.writeFileSync(`${dir}/module.ts`, getModule(name))
    fs.writeFileSync(`${dir}/service.ts`, getService(name))
    fs.writeFileSync(`${dir}/swagger.ts`, getSwagger(name))

    const dirTest = dir + '/__tests__'

    if (fs.existsSync(dirTest)) {
      fs.rmSync(dirTest, { recursive: true });
    }

    fs.mkdirSync(dirTest)

    fs.writeFileSync(`${dirTest}/controller.e2e.spec.ts`, getControllerTest(name))
    fs.writeFileSync(`${dirTest}/module.spec.ts`, getModuleTest(name))
    fs.writeFileSync(`${dirTest}/service.spec.ts`, getServiceTest(name))

    return name

  } catch (error) {
    console.log('error', error)
    if (fs.existsSync(dir)) {
      fs.rmSync(dir, { recursive: true });
    }

    return name
  }
}

const createMonorepoTest = async (name) => {
  const dir = `${__dirname}/scafold/templates/__tests__`

  try {

    if (fs.existsSync(dir)) {
      fs.rmSync(dir, { recursive: true });
    }

    fs.mkdirSync(dir)
    fs.writeFileSync(`${dir}/controller.e2e.spec.ts`, getControllerTest(name))
    fs.writeFileSync(`${dir}/module.spec.ts`, getModuleTest(name))
    fs.writeFileSync(`${dir}/service.spec.ts`, getServiceTest(name))

    return '__tests__'

  } catch (error) {
    console.log('error', error)
    if (fs.existsSync(dir)) {
      fs.rmSync(dir, { recursive: true });
    }

    return '__tests__'
  }
}

export const parseArgumentsInoOptions = async (input) => {
  return {
    module: input.type === 'module' ? await createMonorepoModule(input.name) : false,
    test: input.type === 'test' ? await createMonorepoTest(input.name) : false,
    app: input.type === 'api' ? await createMonorepoApp(input.name) : false
  }
}

export async function cli(args) {

  console.log(bold(green('Selecting template...')))
  const cli = await cliSelect({
    values: [bold('API'), bold('MODULE'), bold('TEST')],
    valueRenderer: (value, selected) => {
      if (selected) {
        return value;
      }

      return value;
    },
  })

  const mapSelectType = { 0: 'api', 1: 'module', 2: 'test' }[cli.id]
  const userInput = { name: undefined, type: undefined }

  userInput.type = mapSelectType

  if (!userInput.type) {
    console.log(red('Type is required'))
    return
  }

  const name = prompt(bold(`Type your ${userInput.type.toUpperCase()} name: `));

  if (!name) {
    console.log(red('Name is required'))
    return
  }

  userInput.name = name

  const options = await parseArgumentsInoOptions(userInput)

  const paths = []

  for (const key in options) {
    if (options[key]) {
      paths.push(path.resolve(`${__dirname}/../src/scafold/templates/`, options[key]))
    }
  }

  try {

    exec('zenity --file-selection --directory --title="Choose your path" --filename=$HOME/', async (err, dest) => {
      if (err) {
        console.log(err)
        return
      }

      const src = paths[0]

      const name = src.substring(src.lastIndexOf('/') + 1, src.length)

      fse.moveSync(src, `${dest}/${name}`.replace('\n', ''), { overwrite: true });

      if (fs.existsSync(src)) {
        fs.rmSync(src, { recursive: true });
      }

      console.log(bold(green('done')))

      if (userInput.type === 'api') {
        console.log(red('!!!!!!!!!!REAMDE!!!!!!!'), bold('https://github.com/mikemajesty/monorepo-nestjs-cli/blob/master/APP.md'))
      }
    });

  } catch (error) {
    console.log(error)
    if (fs.existsSync(paths[0])) {
      fs.rmSync(paths[0], { recursive: true });
    }
  }
}