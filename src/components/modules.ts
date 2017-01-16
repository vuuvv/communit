import { NgModule, ModuleWithProviders } from '@angular/core';

import { HeaderModule } from './header';
import { BadgeModule } from './badge';

const MODULES = [
  HeaderModule,
  BadgeModule,
];

@NgModule({
  imports: [
    HeaderModule.forRoot(),
    BadgeModule.forRoot(),
  ],
  exports: MODULES,
})
export class NgvRootModule {}

@NgModule({
  imports: MODULES,
  exports: MODULES,
})
export class NgvModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: NgvRootModule,
    }
  }
}
