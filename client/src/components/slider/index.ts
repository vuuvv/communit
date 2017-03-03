import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SliderComponent, SliderItemComponent } from './slider';
import { BaseModule } from '../base';

@NgModule({
  imports: [ CommonModule, BaseModule ],
  exports: [ SliderComponent, SliderItemComponent ],
  declarations: [ SliderComponent, SliderItemComponent ],
})
export class SliderModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: SliderModule,
      providers: [],
    }
  }
}

export * from './slider';
