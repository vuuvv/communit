import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';

import { InlineDescComponent } from './inline-desc';

@NgModule({
  imports: [ CommonModule ],
  exports: [ InlineDescComponent ],
  declarations: [ InlineDescComponent ],
})
export class InlineDescModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: InlineDescModule,
      providers: [],
    }
  }
}

export * from './inline-desc';
