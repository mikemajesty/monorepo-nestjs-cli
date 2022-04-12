import { Test } from '@nestjs/testing';
import { GlobalModule } from 'libs/modules/global/module';

import { name, version } from '../../../../package.json';
import { IHealthService } from '../adapter';
import { HealthService } from '../service';

describe('HealthService', () => {
  let healthService: IHealthService;

  beforeEach(async () => {
    const app = await Test.createTestingModule({
      imports: [GlobalModule],
      providers: [
        {
          provide: IHealthService,
          useClass: HealthService,
        },
      ],
    }).compile();

    healthService = app.get(IHealthService);
  });

  describe('getText', () => {
    test('should getText successfully', async () => {
      const text = `${name}-${version} UP!!`;
      await expect(healthService.getText()).resolves.toEqual(text);
    });
  });
});
