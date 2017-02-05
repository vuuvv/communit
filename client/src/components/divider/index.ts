import { NgModule, ModuleWithProviders } from '@angular/core';

import { DividerComponent } from './divider';

@NgModule({
  declarations: [ DividerComponent ],
  exports: [ DividerComponent ],
})
export class DividerModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: DividerModule,
    }
  }
}

export * from './divider';
