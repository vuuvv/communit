import { BaseModel } from './base_model';
import { property } from '../utils';

export class TransactionDetail extends BaseModel {
  @property()
  transactionId: string;
  @property()
  communityId: string;
  @property()
  userId: string;
  @property()
  accountDetailId: string;
  @property()
  amount: number;
  @property()
  remain: number;
}

export const TransactionDetailTableName = 't_transaction_detail';
