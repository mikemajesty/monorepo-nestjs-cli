import { Module } from '@nestjs/common';
import { CommonModule } from 'libs/modules/common/module';
import { GlobalModule } from 'libs/modules/global/module';

import { HealthModule } from './health/module';

@Module({
  imports: [HealthModule, GlobalModule, CommonModule],
})
export class MainModule {}
