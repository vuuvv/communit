import { BaseModel } from './base_model';
export declare class TransactionType extends BaseModel {
    transactionId: string;
    userId: string;
    accountId: string;
    amount: number;
}
export declare const ConfigTableName = "t_transaction_detail";
