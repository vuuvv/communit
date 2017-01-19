import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PanelComponent } from './panel';

@NgModule({
  imports: [ CommonModule ],
  exports: [ PanelComponent ],
  declarations: [ PanelComponent ],
})
export class PanelModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: PanelModule,
      providers: [],
    }
  }
}

export * from './panel';
