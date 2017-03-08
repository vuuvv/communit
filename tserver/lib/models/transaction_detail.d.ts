import { BaseModel } from './base_model';
export declare class TransactionDetail extends BaseModel {
    transactionId: string;
    userId: string;
    accountId: string;
    amount: number;
}
export declare const TransactionDetailTableName = "t_transaction_detail";
