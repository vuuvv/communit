import { BaseModel } from './base_model';
export declare class TransactionDetail extends BaseModel {
    transactionId: string;
    communityId: string;
    userId: string;
    accountDetailId: string;
    amount: number;
    remain: number;
}
export declare const TransactionDetailTableName = "t_transaction_detail";
