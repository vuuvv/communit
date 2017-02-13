import { BaseModel } from './base_model';
export declare class WechatUser extends BaseModel {
    officialAccountId: number;
    userId?: number;
    openId: string;
    nickname: string;
    sex: boolean;
    language: string;
    city: string;
    province: string;
    country: string;
    headimgurl: string;
    subscribeTime: string;
    remark: string;
    groupId: string;
    tagIdList: string;
    latestActiveAt: string;
}
export declare const WechatUserTableName = "t_wechat_user";
