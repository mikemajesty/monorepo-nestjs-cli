import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { ApiException } from 'libs/utils';
import * as request from 'supertest';

import { IModuleService } from '../adapter';
import { ModuleController } from '../controller';
import { ModuleService } from '../service';

describe('<name>Controller (e2e)', () => {
  let app: INestApplication;
  let service: IModuleService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ModuleController],
      providers: [
        {
          provide: IModuleService,
          useClass: ModuleService,
        },
      ],
    }).compile();

    app = module.createNestApplication();
    service = module.get(IModuleService);
    await app.init();
  });

  describe('/module (GET)', () => {
    it(`should getExemple successfully`, async () => {
      return request(app.getHttpServer()).get('/module').expect('exemple');
    });

    it(`should getExemple with error 500`, async () => {
      service.exemple = jest.fn().mockRejectedValue(new ApiException('Error'));
      return request(app.getHttpServer()).get('/module').expect({ statusCode: 500, message: 'Error' });
    });
  });

  afterAll(async () => {
    await app.close();
  });
});
