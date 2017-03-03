import { BaseModel } from './base_model';
import { property } from '../utils';

export class Account extends BaseModel {
  @property()
  typeId: string;
  @property()
  communityId: string;
  @property()
  balance: number = 0;
  @property()
  expiresTime: Date;
}

export const ConfigTableName = 't_account';
