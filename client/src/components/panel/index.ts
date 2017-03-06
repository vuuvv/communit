import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { PanelComponent } from './panel';

@NgModule({
  imports: [ CommonModule, RouterModule ],
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
