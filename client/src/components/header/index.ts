import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HeaderComponent } from './header';

@NgModule({
  imports: [ CommonModule ],
  exports: [ HeaderComponent ],
  declarations: [ HeaderComponent ],
})
export class HeaderModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: HeaderModule,
      providers: [],
    }
  }
}

export * from './header';
