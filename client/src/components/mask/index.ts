import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MaskComponent } from './mask';

@NgModule({
  imports: [ CommonModule ],
  exports: [ MaskComponent ],
  declarations: [ MaskComponent ],
})
export class MaskModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: MaskModule,
      providers: [],
    };
  }
}

export * from './mask';
