import { BaseModel } from './base_model';
import { property } from '../utils';

export class AccountType extends BaseModel {
  @property()
  name: string;
  @property()
  sort: number;
}

export const AccountTypeTableName = 't_account_type';
