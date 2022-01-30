import { Controller, Get } from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';

import { IModuleService } from './adapter';
import { SwagggerResponse } from './swagger';

@Controller()
@ApiTags('module')
export class ModuleController {
  constructor(private readonly service: IModuleService) {}

  @Get('/module')
  @ApiResponse(SwagggerResponse.getExemple[200])
  @ApiResponse(SwagggerResponse.getExemple[500])
  async getExemple(): Promise<string> {
    return this.service.exemple();
  }
}
