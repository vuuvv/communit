import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgvModule } from '../../components';

import { SHARED_COMPONENTS } from './components';

@NgModule({
  imports: [ CommonModule, NgvModule ],
  declarations: [ SHARED_COMPONENTS ],
  exports: [ SHARED_COMPONENTS ],
})
export class SharedModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: SharedModule,
      providers: [],
    }
  }
}

export * from './components';
