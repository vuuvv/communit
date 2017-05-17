import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

import { NgvModule } from '../../components';

import { SHARED_COMPONENTS } from './components';
import { SHARED_SERVICES } from './services';
import { SHARE_PIPES } from './pipes';

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    NgvModule
  ],
  declarations: [ SHARED_COMPONENTS, SHARE_PIPES ],
  exports: [ SHARED_COMPONENTS, SHARE_PIPES ],
})
export class SharedModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: SharedModule,
      providers: [ ...SHARED_SERVICES ],
    };
  }
}

export * from './components';
export * from './services';
export * from './utils';
