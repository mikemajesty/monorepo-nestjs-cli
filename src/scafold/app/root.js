const getJestConfig = () => {
  return `const {
  name
} = require('./package.json');

const {
  pathsToModuleNameMapper
} = require('ts-jest');

const {
  compilerOptions
} = require('../../tsconfig.json');

module.exports = {
  rootDir: 'src',
  displayName: name,
  name,
  preset: 'ts-jest',
  coveragePathIgnorePatterns: ['main.ts', 'swagger.ts', 'node_modules', 'module.ts', 'interface.ts'],
  setupFilesAfterEnv: ['../../../tests/common-initialization.js', '../tests/initialization.js'],
  moduleNameMapper: pathsToModuleNameMapper(compilerOptions.paths, {
    prefix: '<rootDir>/../../../',
  }),
};
`
}

const getTsconfigBuild = () => {
  return `{
  "extends": "../../tsconfig.json",
  "exclude": ["node_modules", "dist", "**/*spec.ts"]
}
`
}

const getTsconfig = (name) => {
  return `{
  "extends": "../../tsconfig.json",
  "compilerOptions": {
    "declaration": false,
    "outDir": "../../dist/apps/${name}-api"
},
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist"]
}
`
}

const getPackage = (name) => {
  return `{
  "name": "@app/${name}.api",
  "version": "v0.0.1",
  "description": "monorepo ${name}-api",
  "scripts": {
    "format": "../../tools/eslint/node_modules/.bin/prettier --write \''**/*.{ts, js, json}\''",
    "test": "../../node_modules/jest/bin/jest.js --maxWorkers=50%",
    "lint": "yarn format && ../../tools/eslint/node_modules/.bin/eslint \''src/**/*.{ts, js, json}\'' --fix"
  },
  "author": {
    "name": "Mike Lima",
    "email": "mike.rodrigues.lima@gmail.com"
  },
  "engines": {
    "node": ">=14 <=16"
  },
  "license": "MIT",
  "dependencies": {},
  "devDependencies": {}
}
`
}

const getDockerFile = (name) => {
  return `FROM node:14

ADD . /app

WORKDIR /app

RUN ls /app -al

RUN yarn && yarn build @app/${name}-api

COPY apps/${name}-api/package.json dist/apps/${name}-api/
COPY apps/${name}-api/tsconfig.build.json dist/apps/${name}-api/
COPY apps/${name}-api/tsconfig.json dist/apps/${name}-api/

EXPOSE 4000

RUN yarn --cwd dist/apps/${name}-api
RUN yarn --cwd dist/apps/libs/modules
RUN yarn --cwd dist/apps/libs/utils
RUN yarn --cwd dist/apps/libs/core

RUN ls dist/apps/${name}-api -al

RUN ls /app -al

RUN yarn

CMD yarn --cwd apps start:${name}-api:prd
`
}

const getEslitignore = () => { 
  return `# dependencies
node_modules

# git, vs config
.vscode
.gitignore
`
}

const getDockerignore = () => { 
  return `../*
  jest.config.js
  node_modules/
  tests/
`
}

module.exports = { getJestConfig, getTsconfigBuild, getTsconfig, getPackage, getDockerFile,  getDockerignore, getEslitignore }