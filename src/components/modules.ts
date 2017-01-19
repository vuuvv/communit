import { NgModule, ModuleWithProviders } from '@angular/core';

import { HeaderModule } from './header';
import { BadgeModule } from './badge';
import { TabbarModule } from './tabbar';
import { IconModule } from './icon';
import { PageModule } from './page';
import { DividerModule } from './divider';
import { FlexBoxModule } from './flexbox';
import { OverlayModule } from './overlay';
import { GroupModule } from './group';
import { CellModule } from './cell';
import { InlineDescModule } from './inline-desc';

const MODULES = [
  HeaderModule,
  BadgeModule,
  TabbarModule,
  IconModule,
  PageModule,
  DividerModule,
  FlexBoxModule,
  OverlayModule,
  GroupModule,
  CellModule,
  InlineDescModule,
];

@NgModule({
  imports: [
    HeaderModule.forRoot(),
    BadgeModule.forRoot(),
    TabbarModule.forRoot(),
    IconModule.forRoot(),
    PageModule.forRoot(),
    DividerModule.forRoot(),
    FlexBoxModule.forRoot(),
    OverlayModule.forRoot(),
    GroupModule.forRoot(),
    CellModule.forRoot(),
    InlineDescModule.forRoot(),
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
