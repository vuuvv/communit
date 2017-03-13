import { BaseModel } from './base_model';
import { property } from '../utils';

export class AccountDetail extends BaseModel {
  @property()
  communityId: string;
  @property()
  userId: string;
  @property()
  typeId: string;
  @property()
  total = 0;
  @property()
  remain = 0;
  @property()
  expiresIn: Date;
}

export const AccountDetailTableName = 't_account_detail';
