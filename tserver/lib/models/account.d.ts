import { BaseModel } from './base_model';
export declare class Account extends BaseModel {
    typeId: string;
    communityId: string;
    userId: string;
    balance: number;
}
export declare const AccountTableName = "t_account";
