import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InlineDescModule } from '../inline-desc';

import { CellComponent } from './cell';

@NgModule({
  imports: [ CommonModule, InlineDescModule ],
  exports: [ CellComponent ],
  declarations: [ CellComponent ],
})
export class CellModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: CellModule,
      providers: [],
    }
  }
}

export * from './cell';
