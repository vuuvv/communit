import { NgModule, ModuleWithProviders } from '@angular/core';

import { BadgeModule } from '../badge';

import { IconComponent } from './icon';

@NgModule({
  exports: [ IconComponent ],
  declarations: [ IconComponent ],
})
export class IconModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: IconModule,
      providers: [],
    }
  }
}

export * from './icon';
