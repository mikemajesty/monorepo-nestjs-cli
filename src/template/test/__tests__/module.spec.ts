import { Test, TestingModule } from '@nestjs/testing';

import { NameModule } from '../module';

describe('<name>Module', () => {
  let module: NameModule;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      providers: [NameModule],
    }).compile();

    module = app.get<NameModule>(NameModule);
  });

  test('should be defined', () => {
    expect(module).toBeInstanceOf(NameModule);
  });
});
