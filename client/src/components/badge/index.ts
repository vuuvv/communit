import { NgModule, ModuleWithProviders } from '@angular/core';

import { BadgeComponent } from './badge';

@NgModule({
  exports: [ BadgeComponent ],
  declarations: [ BadgeComponent ],
})
export class BadgeModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: BadgeModule,
      providers: [],
    }
  }
}

export * from './badge';
