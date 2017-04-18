import { BaseModel } from './base_model';
export declare class ServiceUser extends BaseModel {
    /**
     * 服务Id
     */
    serviceId: string;
    /**
     * 社区Id
     */
    communityId: string;
    /**
     * 用户Id
     */
    userId: string;
    /**
     * 'submit': 提交出价
     * 'reject': 用户拒绝该出价
     * 'accept': 用户接受该出价
     * 'done': 交易已完成
     *
     */
    status: string;
    /**
     * 愿出积分
     */
    points: number;
    /**
     * 描述
     */
    description: string;
    /**
     * 交易订单Id
     */
    orderId: string;
    /**
     * 实付积分
     */
    payedPoints: string;
    /**
     * 拒绝原因
     */
    rejectDescription: string;
}
export declare const ServiceUserTableName = "t_service_user";
