import { BaseModel } from './base_model';
import { property } from '../utils';

export class TransactionType extends BaseModel {
  @property()
  transactionId: string;
  @property()
  userId: string;
  @property()
  accountId: string;
  @property()
  amount: number;
}

export const ConfigTableName = 't_transaction_detail';
