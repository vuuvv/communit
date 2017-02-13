import { BaseModel } from './base_model';
export declare class WechatOfficialAccount extends BaseModel {
    name: string;
    appId: string;
    appSecret: string;
    token: string;
    accessToken: string;
    expiresIn: number;
}
export declare const WechatOfficialAccountTableName = "t_wechat_official_account";
