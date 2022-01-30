import { Module } from '@nestjs/common';

import { IModuleService } from './adapter';
import { ModuleController } from './controller';
import { ModuleService } from './service';

@Module({
  controllers: [ModuleController],
  providers: [
    {
      provide: IModuleService,
      useClass: ModuleService,
    },
  ],
  exports: [IModuleService],
})
export class NameModule {}
