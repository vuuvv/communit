import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ImageComponent } from './image';
import { BaseModule } from '../base';

@NgModule({
  imports: [ CommonModule, BaseModule ],
  exports: [ ImageComponent ],
  declarations: [ ImageComponent ],
})
export class ImageModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: ImageModule,
      providers: [],
    }
  }
}

export * from './image';
