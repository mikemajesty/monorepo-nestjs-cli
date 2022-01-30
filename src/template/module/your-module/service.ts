import { Injectable } from '@nestjs/common';

import { IModuleService } from './adapter';

@Injectable()
export class ModuleService implements IModuleService {
  exemple(): string {
    return this.exemple.name;
  }
}
