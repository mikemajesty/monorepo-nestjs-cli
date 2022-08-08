function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

const getMain = (name) => {
  return `import { HttpStatus, RequestMethod, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { description, name, version } from 'apps/${name}-api/package.json';
import { bold } from 'colorette';
import { ILoggerService } from 'libs/modules/global/logger/adapter';
import { ISecretsService } from 'libs/modules/global/secrets/adapter';
import { DEFAULT_TAG, SWAGGER_API_ROOT } from 'libs/utils/documentation/constants';
import { AppExceptionFilter } from 'libs/utils/filters/http-exception.filter';
import { ExceptionInterceptor } from 'libs/utils/interceptors/exception/http-exception.interceptor';
import { HttpLoggerInterceptor } from 'libs/utils/interceptors/logger/http-logger.interceptor';
import { TracingInterceptor } from 'libs/utils/interceptors/logger/http-tracing.interceptor';

import { MainModule } from './modules/module';

async function bootstrap() {
  const app = await NestFactory.create(MainModule, {
    bufferLogs: true,
    cors: true,
  });

  app.useGlobalPipes(
    new ValidationPipe({
      errorHttpStatusCode: HttpStatus.PRECONDITION_FAILED,
    }),
  );

  const loggerService = app.get(ILoggerService);

  loggerService.setApplication(name);
  app.useGlobalFilters(new AppExceptionFilter(loggerService));

  app.useGlobalInterceptors(
    new ExceptionInterceptor(),
    new HttpLoggerInterceptor(loggerService),
    new TracingInterceptor({ app: name, version }, loggerService),
  );

  const {
    ${name}API: { port: PORT, url },
    ENV,
    KIBANA_URL,
    JEAGER_URL,
    MONGO_EXPRESS_URL,
    REDIS_COMMANDER_URL,
  } = app.get(ISecretsService);

  app.useLogger(loggerService);

  app.useGlobalPipes(new ValidationPipe({ errorHttpStatusCode: HttpStatus.PRECONDITION_FAILED }));

  app.setGlobalPrefix('api', {
    exclude: [{ path: 'health', method: RequestMethod.GET }],
  });

  const config = new DocumentBuilder()
    .setTitle(name)
    .setDescription(description)
    .setVersion(version)
    .addTag(DEFAULT_TAG)
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup(SWAGGER_API_ROOT, app, document);

  loggerService.log(''🟢 ##{name}-api listening at ##{bold(PORT)} on ##{bold(ENV.toUpperCase())} 🟢\n'');

  await app.listen(PORT);

  const openApiURL = ''##{url}/##{SWAGGER_API_ROOT}'';

  loggerService.log(''🔵 swagger listening at ##{bold(openApiURL)}'');
  loggerService.log(''🔵 mongo-express listening at ##{bold(MONGO_EXPRESS_URL)}'');
  loggerService.log(''🔵 redis-commander listening at ##{bold(REDIS_COMMANDER_URL)}'');
  loggerService.log(''🔵 kibana listening at ##{bold(KIBANA_URL)}'');
  loggerService.log(''🔵 jeager listening at ##{bold(JEAGER_URL)}'');
}
bootstrap();
`
}


const getSourceModule = () => {
  return `import { Module } from '@nestjs/common';
import { CommonModule } from 'libs/modules/common/module';
import { GlobalModule } from 'libs/modules/global/module';

import { HealthModule } from './health/module';

@Module({
  imports: [
    HealthModule,
    GlobalModule,
    CommonModule
  ],
})
export class MainModule {}
  `
}

const health = (name) => {
  return {
    adapter: `export abstract class IHealthService {
  abstract getText(): Promise<string>;
}
`,
    controller: `import { Controller, Get } from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';

import { IHealthService } from './adapter';
import { SwagggerResponse } from './swagger';

@Controller()
@ApiTags('health')
export class HealthController {
  constructor(private readonly healthService: IHealthService) {}

  @Get('/health')
  @ApiResponse(SwagggerResponse.getHealth[200])
  @ApiResponse(SwagggerResponse.getHealth[500])
  async getHealth(): Promise<string> {
    return this.healthService.getText();
  }
}
`,
module: `import { Module } from '@nestjs/common';
import { LoggerModule } from 'libs/modules/global/logger/module';

import { IHealthService } from './adapter';
import { HealthController } from './controller';
import { HealthService } from './service';

@Module({
  imports: [LoggerModule],
  controllers: [HealthController],
  providers: [
    {
      provide: IHealthService,
      useClass: HealthService,
    },
  ],
})
export class HealthModule {}
`,
service: `import { Injectable } from '@nestjs/common';
import { name, version } from 'apps/${name}-api/package.json';
import { ILoggerService } from 'libs/modules/global/logger/adapter';

import { IHealthService } from './adapter';

@Injectable()
export class HealthService implements IHealthService {
  constructor(private readonly loggerService: ILoggerService) {}

  async getText(): Promise<string> {
    const appName = ''##{name}-##{version} UP!!'';
    this.loggerService.info({ message: appName, context: ''HealthService/getText'' });

    return appName;
  }
}
`,
swagger: `import { name } from 'apps/${name}-api/package.json';
import { Swagger } from 'libs/utils/documentation/swagger';

export const SwagggerResponse = {
  getHealth: {
    200: Swagger.defaultResponseText({ status: 200, text: ''##{name} UP!!'' }),
    500: Swagger.defaultResponseError({
      status: 500,
      route: '/health',
    }),
  },
};

export const SwagggerRequest = {
  /** If requesters has a body.  */
};
`
  }
}

const healthTests = (name) => { 
  return {
    controller: `import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { ILoggerService } from 'libs/modules/global/logger/adapter';
import { ApiException } from 'libs/utils';
import * as request from 'supertest';

import { name, version } from '../../../../package.json';
import { IHealthService } from '../adapter';
import { HealthController } from '../controller';
import { HealthService } from '../service';

describe('HealthController (e2e)', () => {
  let app: INestApplication;
  let service: IHealthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [HealthController],
      providers: [
        {
          provide: IHealthService,
          useFactory: () => new HealthService({ info: jest.fn() } as unknown as ILoggerService),
        },
      ],
      imports: [],
    }).compile();

    app = module.createNestApplication();
    service = module.get(IHealthService);
    await app.init();
  });

  describe('/health (GET)', () => {
    const text = ''##{name}-##{version} UP!!'';

    it(''should return ##{text}'', async () => {
      return request(app.getHttpServer()).get('/health').expect(text);
    });

    it(''should getHealth with throw statusCode 500'', async () => {
      service.getText = jest.fn().mockRejectedValue(new ApiException('Error'));
      return request(app.getHttpServer()).get('/health').expect({ statusCode: 500, message: 'Error' });
    });
  });

  afterAll(async () => {
    await app.close();
  });
});
`,
    module: `import { Test, TestingModule } from '@nestjs/testing';

import { HealthModule } from '../module';

describe('HealthModule', () => {
  let healthModule: HealthModule;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      providers: [HealthModule],
    }).compile();

    healthModule = app.get<HealthModule>(HealthModule);
  });

  it('should be defined', () => {
    expect(healthModule).toBeInstanceOf(HealthModule);
  });
});
`,
    service: `import { Test } from '@nestjs/testing';
import { ILoggerService } from 'libs/modules/global/logger/adapter';

import { name, version } from '../../../../package.json';
import { IHealthService } from '../adapter';
import { HealthService } from '../service';

describe('HealthService', () => {
  let healthService: IHealthService;

  beforeEach(async () => {
    const app = await Test.createTestingModule({
      imports: [],
      providers: [
        {
          provide: IHealthService,
          useFactory: () => new HealthService({ info: jest.fn() } as unknown as ILoggerService),
        },
      ],
    }).compile();

    healthService = app.get(IHealthService);
  });

  describe('getText', () => {
    test('should getText successfully', async () => {
      await expect(healthService.getText()).resolves.toEqual(''##{name}-##{version} UP!!'');
    });
  });
});
`,
  }
}

module.exports = { getMain, getSourceModule, health, healthTests }