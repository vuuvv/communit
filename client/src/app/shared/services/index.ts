import { AuthorizeGuard } from './auth-guard';
import { Http } from './http';
import { AuthorizeService } from './authorize';

export const SHARED_SERVICES = [
  Http,
  AuthorizeGuard,
  AuthorizeService,
];

export * from './http';
export * from './authorize';
export * from './auth-guard';
