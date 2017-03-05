import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BaseModule } from '../base';

import { XScrollComponent } from './xscroll';

@NgModule({
  imports: [ CommonModule, BaseModule ],
  exports: [ XScrollComponent ],
  declarations: [ XScrollComponent ],
})
export class XSCrollModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: XSCrollModule,
      providers: [],
    }
  }
}

export * from './xscroll';
