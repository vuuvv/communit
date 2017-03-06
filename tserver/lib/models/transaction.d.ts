import { BaseModel } from './base_model';
export declare class TransactionType extends BaseModel {
    userId: string;
    communityId: string;
    typeId: string;
    amount: number;
}
export declare const ConfigTableName = "t_transaction";
