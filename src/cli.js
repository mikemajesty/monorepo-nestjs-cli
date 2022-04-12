import arg from 'arg';
import dialog from 'node-file-dialog';
import { exec } from 'child_process';
import fs from 'fs-extra';
import * as path from 'path';
import { EventEmitter } from 'events';
import mustache from 'mustache';
import {isFunction, isObject} from 'core-util-is';
import { glob } from 'glob-gitignore';

const REGEX_IS_GLOB_FILE = /[^\/]$/

export function parseArgumentsInoOptions(rawArgs) {
  const args = arg(
  {
    '--module': Boolean,
    '--test': Boolean,
    '--app': Boolean,
  },
  {
    argv: rawArgs.slice(2)
  }
  )
  return {
    template: args._[0],
    module: args['--module'] ? `${__dirname}/template/module` : '',
    test: args['--test'] ? `${__dirname}/template/test` : '',
    app: args['--app'] ? `${__dirname}/template/app` : ''
  }
}
class Scaffold extends EventEmitter {
  constructor (options) {
    super()

    if (!isObject(options)) {
      throw new TypeError('options must be an object')
    }

    const {
      render,
      override = true,
      backup = true,
      data,
      ignore
    } = options

    if (!isFunction(render)) {
      throw new TypeError('options.render must be a function')
    }

    if (!isObject(data)) {
      throw new TypeError('options.data must be an object')
    }

    this._render = render
    this._override = override
    this._backup = backup
    this._data = data
    this._ignore = ignore
  }

  // - from/to: we dont know whether it is a file or directory
  // - fromDir/toDir: it is a dir
  // - fromFile/toFile: it is a file

  // We don't know
  copy (from, to) {
    if (Object(from) === from) {
      return this._copyMaps(from)
    }

    return this._copy(from, to)
  }

  _copyMaps (map) {
    const tasks = Object.keys(map).map(from => {
      const to = map[from]
      return this._copy(from, to)
    })

    return Promise.all(tasks)
  }

  // We don't know whether from or to is a file or directory
  async _copy (from, to) {
    const stat = await fs.stat(from)

    // If from is a directory, we suppose that `to` is a directory
    if (stat.isDirectory()) {
      return this._copyDirToDir(from, to)
    }

    return fs.stat(to)
    .then(
      stat => {
        if (stat.isDirectory()) {
          // Copy file -> Dir
          to = path.join(to, path.basename(from))
        }

        // Copy file -> file
        return this._copyFileToFile(from, to)
      },
      () => this._copyFileToFile(from, to)
    )
  }

  // Copy dir to dir
  async _copyDirToDir (fromDir, toDir) {
    const files = await this._globDir(fromDir)
    const map = {}

    console.log(files)
    files.forEach(file => {
      const fromFile = path.join(fromDir, file)
      const toFile = path.join(toDir, file)

      // Only substitute path when `to` is not explicitly specified.
      map[fromFile] = toFile
    })

    return this._copyFilesToFiles(map)
  }

  async _globDir (root) {
    const options = {
      cwd: root,
      dot: true,
      // Then, the dirs in `files` will end with a slash `/`
      mark: true
    }

    if (this._ignore) {
      options.ignore = this._ignore
    }

    const files = await glob('**/*', options)
    return files.filter(REGEX_IS_GLOB_FILE.test, REGEX_IS_GLOB_FILE)
  }

  _copyFilesToFiles (map) {
    const tasks = Object.keys(map).map(from => {
      const to = map[from]
      return this._copyFileToFile(from, to)
    })

    return Promise.all(tasks)
  }

  // Substitute filename
  _to (to) {
    return this._render(to, this._data)
  }

  async _readAndTemplate (path) {
    const content = await fs.readFile(path)
    return this._render(content.toString(), this._data)
  }

  async write (to, template) {
    const override = await this._shouldOverride(to)
    if (!override) {
      return
    }

    const content = this._render(template, this._data)
    return fs.outputFile(to, content)
  }

  async _copyFileToFile (fromFile, to) {
    const toFile = this._to(to)
    const override = await this._shouldOverride(toFile)
    if (!override) {
      return
    }

    const content = await this._readAndTemplate(fromFile)
    const stat = await fs.stat(fromFile)
    return fs.outputFile(toFile, content, {
      mode: stat.mode
    })
  }

  _shouldOverride (file) {
    const override = this._override
    const backup = this._backup

    return fs.exists(file)
    .then(exists => {
      // File not exists
      if (!exists) {
        return true
      }

      // Exists, and not override
      if (!override) {
        return false
      }

      // Exists, override, and need not to create backup
      if (!backup) {
        return true
      }
    })
  }
}

export async function cli(args) {
  let options = parseArgumentsInoOptions(args)
  const config = { type:'directory' }
  const fiePath = await dialog(config)

  new Scaffold({
    data: {
      name: 'module',
      main: 'lib/index.js'
    },
    render: mustache.render
  })
  .copy(options.module || options.test || options.app, fiePath[0])
  .then(() => {
    console.log('done')
  })

  console.log('options', options, fiePath[0])
}