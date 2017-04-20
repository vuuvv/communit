import { TabbarComponent } from './tabbar';
import { QuickentryComponent, QuickentryItemComponent } from './quickentry';
import { EmptyPageComponent } from './empty-page';
import { ServiceListItemComponent } from './service-list-item';
import { ProductListItemComponent } from './product-list-item';
import { ProductDetailComponent } from './product-detail';
import { OrderComponent } from './order.component';
import { OrderItemComponent } from './order-item.component';
import { WechatUploaderComponent } from './wechat-uploader';
import { WechatMultipleUploaderComponent } from './wechat-multiple-uploader';
import { ServiceDetailComponent } from './service-detail';

export const SHARED_COMPONENTS = [
  TabbarComponent,
  QuickentryComponent,
  QuickentryItemComponent,
  EmptyPageComponent,
  ServiceListItemComponent,
  ProductListItemComponent,
  ProductDetailComponent,
  OrderComponent,
  OrderItemComponent,
  WechatUploaderComponent,
  WechatMultipleUploaderComponent,
  ServiceDetailComponent,
];

export * from './tabbar';
export * from './quickentry';
export * from './empty-page';
export * from './service-list-item';
export * from './wechat-uploader';
export * from './wechat-multiple-uploader';

