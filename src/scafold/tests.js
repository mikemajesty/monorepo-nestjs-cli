const capitalizeFirstLetter = (name) => {
  return name.charAt(0).toUpperCase() + name.slice(1);
}

const getControllerTest = (name) => {
  const nameClass = capitalizeFirstLetter(name)
  return `import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { GlobalModule } from 'libs/modules/global/module';
import { ApiException } from 'libs/utils';
import * as request from 'supertest';

import { I${nameClass}Service } from '../adapter';
import { ${nameClass}Controller } from '../controller';
import { ${nameClass}Service } from '../service';

describe('${nameClass}Controller (e2e)', () => {
  let app: INestApplication;
  let service: I${nameClass}Service;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [${nameClass}Controller],
      providers: [
        {
          provide: I${nameClass}Service,
          useClass: ${nameClass}Service,
        },
      ],
      imports: [GlobalModule],
    }).compile();

    app = module.createNestApplication();
    service = module.get(I${nameClass}Service);
    await app.init();
  });

  describe('/${name} (GET)', () => {
    it('should ${name} successfully', async () => {
      return request(app.getHttpServer()).get('/${name}').expect('OK');
    });

    it('should throw 500 when unhandled exception', async () => {
      service.get${nameClass} = jest.fn().mockRejectedValue(new ApiException('Error'));
      return request(app.getHttpServer()).get('/${name}').expect({ statusCode: 500, message: 'Error' });
    });
  });

  afterAll(async () => {
    await app.close();
  });
});
`
}

const getModuleTest = (name) => {
  const nameClass = capitalizeFirstLetter(name)
  return `import { Test, TestingModule } from '@nestjs/testing';

import { ${nameClass}Module } from '../module';

describe('${nameClass}Module', () => {
  let ${name}Module: ${nameClass}Module;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      providers: [${nameClass}Module],
    }).compile();

    ${name}Module = app.get<${nameClass}Module>(${nameClass}Module);
  });

  test('should be defined', () => {
    expect(${name}Module).toBeInstanceOf(${nameClass}Module);
  });
});
`
}

const getServiceTest = (name) => {
  const nameClass = capitalizeFirstLetter(name)
  return `import { Test } from '@nestjs/testing';
import { GlobalModule } from 'libs/modules/global/module';
import { ApiException } from 'libs/utils';

import { I${nameClass}Service } from '../adapter';
import { ${nameClass}Service } from '../service';

describe('${nameClass}Service', () => {
  let ${name}Service: I${nameClass}Service;

  beforeEach(async () => {
    const app = await Test.createTestingModule({
      imports: [GlobalModule],
      providers: [
        {
          provide: I${nameClass}Service,
          useClass: ${nameClass}Service,
        },
      ],
    }).compile();

    ${name}Service = app.get(I${nameClass}Service);
  });

  describe('get${nameClass}', () => {
    test('should get${nameClass} successfully', async () => {
      await expect(${name}Service.get${nameClass}()).resolves.toEqual('OK');
    });

    it('should throw 500 when unhandled exception', async () => {
      ${name}Service.get${nameClass} = jest.fn().mockRejectedValue(new ApiException('Error'));
      await expect(${name}Service.get${nameClass}()).rejects.toThrow('Error');
    });
  });
});
`
}

module.exports = { getControllerTest, getModuleTest, getServiceTest }