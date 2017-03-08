import { BaseModel } from './base_model';
import { property } from '../utils';

export class TransactionDetail extends BaseModel {
  @property()
  transactionId: string;
  @property()
  userId: string;
  @property()
  accountId: string;
  @property()
  amount: number;
}

export const TransactionDetailTableName = 't_transaction_detail';
