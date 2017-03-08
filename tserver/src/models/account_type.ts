import { BaseModel } from './base_model';
import { property } from '../utils';

export class AccountType extends BaseModel {
  @property()
  name: string;
}

export const AccountTypeTableName = 't_account_type';
