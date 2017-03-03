import { BaseModel } from './base_model';
import { property } from '../utils';

export class TransactionType extends BaseModel {
  @property()
  name: string;
}

export const ConfigTableName = 't_transaction_type';
