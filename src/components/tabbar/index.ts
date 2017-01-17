import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BadgeModule } from '../badge';

import { TabbarComponent, TabbarItemComponent } from './tabbar';

@NgModule({
  imports: [ CommonModule, BadgeModule ],
  exports: [ TabbarComponent, TabbarItemComponent ],
  declarations: [ TabbarComponent, TabbarItemComponent ],
})
export class TabbarModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: TabbarModule,
      providers: [],
    }
  }
}

export * from './tabbar';
