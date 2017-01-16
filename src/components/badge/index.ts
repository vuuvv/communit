import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BadgeComponent } from './badge';

@NgModule({
  imports: [ CommonModule ],
  exports: [ BadgeComponent ],
  declarations: [ BadgeComponent ],
})
export class BadgeModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: BadgeModule,
      providers: [],
    }
  }
}

export * from './badge';
