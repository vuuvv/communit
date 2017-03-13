import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MaskModule } from '../mask';
import { QrcodeComponent } from './qrcode';

@NgModule({
  imports: [ CommonModule, MaskModule ],
  exports: [ QrcodeComponent ],
  declarations: [ QrcodeComponent ],
})
export class QrcodeModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: QrcodeModule,
      providers: [],
    };
  }
}

export * from './qrcode';
