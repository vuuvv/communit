import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MaskModule } from '../mask';
import { PickerComponent } from './picker';

@NgModule({
  imports: [ CommonModule, MaskModule ],
  exports: [ PickerComponent ],
  declarations: [ PickerComponent ],
})
export class PickerModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: PickerModule,
      providers: [],
    };
  }
}

export * from './picker';
