import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InlineDescModule } from '../inline-desc';

import { CellComponent } from './cell';
import { IconModule } from '../icon';

@NgModule({
  imports: [ CommonModule, InlineDescModule, IconModule ],
  exports: [ CellComponent ],
  declarations: [ CellComponent ],
})
export class CellModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: CellModule,
      providers: [],
    };
  }
}

export * from './cell';
