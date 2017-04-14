import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ImgPlaceholderComponent } from './img-placeholder';
import { BaseModule } from '../base';
import { IconModule } from '../icon';
import { ImageModule } from '../image';

@NgModule({
  imports: [ CommonModule, BaseModule, IconModule, ImageModule ],
  exports: [ ImgPlaceholderComponent ],
  declarations: [ ImgPlaceholderComponent ],
})
export class ImgPlaceholderModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: ImgPlaceholderModule,
      providers: [],
    }
  }
}

export * from './img-placeholder';
