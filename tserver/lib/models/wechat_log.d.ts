import { BaseModel } from './base_model';
export declare class WechatLog extends BaseModel {
    officialAccountId: number;
    request: string;
    responst: string;
    type: string;
    event: string;
    from: string;
    to: string;
}
export declare const WechatLogTableName = "t_wechat_log";
