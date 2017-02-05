import { NgModule, ModuleWithProviders } from '@angular/core';

import { CORE_PIPES } from './pipes';

@NgModule({
  declarations: [
    CORE_PIPES,
  ],
  exports: [
    CORE_PIPES,
  ]
})
export class BaseModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: BaseModule,
    }
  }
}

export * from './pipes';
