import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InlineDescModule } from '../inline-desc';

import { BoxComponent } from './box';
import { IconModule } from '../icon';

@NgModule({
  imports: [ CommonModule, InlineDescModule, IconModule ],
  exports: [ BoxComponent ],
  declarations: [ BoxComponent ],
})
export class BoxModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: BoxModule,
      providers: [],
    };
  }
}

export * from './box';
