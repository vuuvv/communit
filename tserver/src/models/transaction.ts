import { BaseModel } from './base_model';
import { property } from '../utils';

export class Transaction extends BaseModel {
  @property()
  userId: string;
  @property()
  communityId: string;
  @property()
  typeId: string;
  @property()
  amount: number;
  @property()
  remain: number;
  @property()
  remainDetail: string;
  @property()
  reverseTransactionId: string;
  @property()
  orderId: string;
}

export const TransactionTableName = 't_transaction';
