import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { NgvModule } from '../../components';

import { SHARED_COMPONENTS } from './components';
import { SHARED_SERVICES } from './services';

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    NgvModule
  ],
  declarations: [ SHARED_COMPONENTS ],
  exports: [ SHARED_COMPONENTS ],
})
export class SharedModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: SharedModule,
      providers: [ ...SHARED_SERVICES ],
    }
  }
}

export * from './components';
export * from './services';
