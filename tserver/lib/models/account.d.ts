import { BaseModel } from './base_model';
export declare class Account extends BaseModel {
    typeId: string;
    communityId: string;
    balance: number;
    expiresTime: Date;
}
export declare const AccountTableName = "t_account";
