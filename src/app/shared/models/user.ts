import { Account } from './account';
import { UserInfo } from './user-info';
import { Store } from './store';

export class User {
  account: Account[];
  user: UserInfo;
  stores: Store[];
}