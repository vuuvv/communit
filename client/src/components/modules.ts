import { NgModule, ModuleWithProviders } from '@angular/core';

import { BaseModule } from './base';
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
import { PanelModule } from './panel';
import { TabModule } from './tab';
import { SliderModule } from './slider';
import { ImageModule } from './image';
import { MaskModule } from './mask';
import { PickerModule } from './picker';
import { XSCrollModule } from './xscroll';
import { RankModule } from './rank';
import { SearchbarModule } from './searchbar';
import { DynamicFormModule } from './dynamic-form';
import { QrcodeModule } from './qrcode';

const MODULES = [
  BaseModule,
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
  PanelModule,
  TabModule,
  SliderModule,
  ImageModule,
  MaskModule,
  PickerModule,
  XSCrollModule,
  RankModule,
  SearchbarModule,
  DynamicFormModule,
  QrcodeModule,
];

@NgModule({
  imports: [
    BaseModule.forRoot(),
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
    PanelModule.forRoot(),
    TabModule.forRoot(),
    SliderModule.forRoot(),
    ImageModule.forRoot(),
    MaskModule.forRoot(),
    PickerModule.forRoot(),
    XSCrollModule.forRoot(),
    RankModule.forRoot(),
    SearchbarModule.forRoot(),
    DynamicFormModule.forRoot(),
    QrcodeModule.forRoot(),
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
