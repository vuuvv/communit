import { BaseModel } from './base_model';
export declare class WechatOfficialAccount extends BaseModel {
    name: string;
    appId: string;
    appSecret: string;
    token: string;
    accessToken: string;
    expiresIn: Date;
    jsapiticket: string;
    jsapitickettime: Date;
}
export declare const WechatOfficialAccountTableName = "weixin_account";
