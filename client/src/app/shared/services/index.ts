import { AuthorizeGuard } from './auth-guard';
import { Http } from './http';
import { AuthorizeService } from './authorize';
import { WechatService } from './wechat';

export const SHARED_SERVICES = [
  Http,
  AuthorizeGuard,
  AuthorizeService,
  WechatService,
];

export * from './http';
export * from './authorize';
export * from './auth-guard';
