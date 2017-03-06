import { NgModule, ModuleWithProviders } from '@angular/core';

import { CORE_DIRECTIVES } from './directives';
import { CORE_PIPES } from './pipes';

@NgModule({
  declarations: [
    CORE_DIRECTIVES,
    CORE_PIPES,
  ],
  exports: [
    CORE_DIRECTIVES,
    CORE_PIPES,
  ]
})
export class BaseModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: BaseModule,
    };
  }
}

export * from './pipes';
export * from './directives';
export * from './utils';
