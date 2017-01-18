import { NgModule, ModuleWithProviders } from '@angular/core';

import { HeaderModule } from './header';
import { BadgeModule } from './badge';
import { TabbarModule } from './tabbar';
import { IconModule } from './icon';
import { PageModule } from './page';
import { DividerModule } from './divider';
import { FlexBoxModule } from './flexbox';

const MODULES = [
  HeaderModule,
  BadgeModule,
  TabbarModule,
  IconModule,
  PageModule,
  DividerModule,
  FlexBoxModule,
];

@NgModule({
  imports: [
    HeaderModule.forRoot(),
    BadgeModule.forRoot(),
  ],
  exports: MODULES,
})
export class NgvRootModule {}

@NgModule({
  imports: MODULES,
  exports: MODULES,
})
export class NgvModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: NgvRootModule,
    }
  }
}
