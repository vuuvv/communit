import { BaseModel } from './base_model';
export declare class AccountDetail extends BaseModel {
    communityId: string;
    userId: string;
    typeId: string;
    total: number;
    remain: number;
    expiresIn: Date;
}
export declare const AccountDetailTableName = "t_account_detail";
