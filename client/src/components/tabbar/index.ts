import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BadgeModule } from '../badge';

import { TabbarComponent, TabbarItemComponent, TabbarButtonComponent } from './tabbar';

@NgModule({
  imports: [ CommonModule, BadgeModule ],
  exports: [ TabbarComponent, TabbarItemComponent, TabbarButtonComponent ],
  declarations: [ TabbarComponent, TabbarItemComponent, TabbarButtonComponent ],
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
