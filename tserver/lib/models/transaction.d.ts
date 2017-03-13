import { BaseModel } from './base_model';
export declare class Transaction extends BaseModel {
    userId: string;
    communityId: string;
    typeId: string;
    amount: number;
    remain: number;
    remainDetail: string;
    reverseTransactionId: string;
}
export declare const TransactionTableName = "t_transaction";
