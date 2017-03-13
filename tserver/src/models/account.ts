import { BaseModel } from './base_model';
import { property } from '../utils';

export class Account extends BaseModel {
  @property()
  typeId: string;
  @property()
  communityId: string;
  @property()
  userId: string;
  @property()
  balance = 0;
}

export const AccountTableName = 't_account';
