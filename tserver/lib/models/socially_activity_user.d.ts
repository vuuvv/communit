import { BaseModel } from './base_model';
export declare class SociallyActivityUserStatus {
    static Submit: string;
    static Joined: string;
    static Reject: string;
    static Payed: string;
    static Refund: string;
}
export declare class SociallyActivityUser extends BaseModel {
    /**
     * 活动Id
     */
    activityId: string;
    /**
     * 用户Id
     */
    userId: string;
    /**
     * 社区Id
     */
    communityId: string;
    /**
     * 状态, 用户状态, 'submit'报名, 'joined'审核通过, 'checked'已签到, 'reject' 报名未通过
     */
    status: string;
    orderId: string;
    points: number;
    constructor();
}
export declare const SociallyActivityUserTableName = "t_socially_activity_user";
