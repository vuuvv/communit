import { BaseModel } from './base_model';
import { property } from '../utils';

export class TransactionType extends BaseModel {
  @property()
  userId: string;
  @property()
  communityId: string;
  @property()
  typeId: string;
  @property()
  amount: number;
}

export const ConfigTableName = 't_transaction';
