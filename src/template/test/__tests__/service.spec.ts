import { Test } from '@nestjs/testing';

import { IModuleService } from '../adapter';
import { ModuleService } from '../service';

describe('HealthService', () => {
  let healthService: IModuleService;

  beforeEach(async () => {
    const app = await Test.createTestingModule({
      providers: [
        {
          provide: IModuleService,
          useClass: ModuleService,
        },
      ],
    }).compile();

    healthService = app.get(IModuleService);
  });

  describe('exemple', () => {
    test('should exemple successfully', () => {
      expect(healthService.exemple()).toEqual('exemple');
    });
  });
});
