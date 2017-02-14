import { BaseModel } from './base_model';
export declare class User extends BaseModel {
    phone: string;
    name: string;
    area: string;
    address: string;
    avatar?: string;
    sex?: number;
}
export declare const UserTableName = "t_user";
