import { AuthorizeGuard } from './auth-guard';
import { Http } from './http';
import { AuthorizeService } from './authorize';
import { FormService } from './form';

export const SHARED_SERVICES = [
  Http,
  AuthorizeGuard,
  AuthorizeService,
  FormService,
];

export * from './http';
export * from './authorize';
export * from './auth-guard';
export * from './form';
