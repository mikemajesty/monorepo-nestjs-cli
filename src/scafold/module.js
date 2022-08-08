function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

const getController = (name) => {
  const nameClass = capitalizeFirstLetter(name)
  return `import { Controller, Get } from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';

import { I${nameClass}Service } from './adapter';
import { SwagggerResponse } from './swagger';

@Controller('${name}')
@ApiTags('${name}')
export class ${nameClass}Controller {
  constructor(private readonly ${name}Service: I${nameClass}Service) {}

  @Get('/')
  @ApiResponse(SwagggerResponse.get${nameClass}[200])
  @ApiResponse(SwagggerResponse.get${nameClass}[500])
  async get${nameClass}(): Promise<string> {
    return this.${name}Service.get${nameClass}();
  }
}
`
}

const getAdapter = (name) => {
  const nameClass = capitalizeFirstLetter(name)
  return `export abstract class I${nameClass}Service {
  abstract get${nameClass}(): Promise<string>;
}
`
}

const getModule = (name) => {
  const nameClass = capitalizeFirstLetter(name)
  return `import { Module } from '@nestjs/common';

import { I${nameClass}Service } from './adapter';
import { ${nameClass}Controller } from './controller';
import { ${nameClass}Service } from './service';

@Module({
  controllers: [${nameClass}Controller],
  providers: [
    {
      provide: I${nameClass}Service,
      useClass: ${nameClass}Service,
    },
  ],
})
export class ${nameClass}Module {}
`
}

const getService = (name) => {
  const nameClass = capitalizeFirstLetter(name)
  return `import { Injectable } from '@nestjs/common';

import { I${nameClass}Service } from './adapter';

@Injectable()
export class ${nameClass}Service implements I${nameClass}Service {
  async get${nameClass}(): Promise<string> {
    return 'OK';
  }
}
`
}

const getSwagger = (name) => {
  const nameClass = capitalizeFirstLetter(name)
  return `import { Swagger } from 'libs/utils/documentation/swagger';

export const SwagggerResponse = {
  getClient: {
    200: Swagger.defaultResponseText({
      status: 200,
      text: 'OK',
    }),
    500: Swagger.defaultResponseError({
      status: 500,
      route: 'api/client',
    }),
  },
};

export const SwagggerRequest = {
  /** If requesters has a body.  */
};
`
}

module.exports = { getController, getAdapter, getModule, getService, getSwagger }