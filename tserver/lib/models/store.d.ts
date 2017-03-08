import { BaseModel } from './base_model';
export declare class Store extends BaseModel {
    /**
     * 所属用户Id
     */
    userId: string;
    /**
     * 所属社区Id
     */
    communityId: string;
    /**
     * 店铺状态, 审核中(submit), 正常运行(normal), 关闭(closed), 审核不通过(reject)
     */
    status: string;
    /**
     * 店铺描述
     */
    description: string;
    /**
     * 店铺地址
     */
    address: string;
    /**
     * 联系方式
     */
    tel: string;
    /**
     * 联系人
     */
    contact: string;
    constructor();
}
export declare const StoreTableName = "t_store";
