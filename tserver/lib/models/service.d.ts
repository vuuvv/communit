import { BaseModel } from './base_model';
export declare class Service extends BaseModel {
    /**
     * 种类Id
     */
    categoryId: string;
    /**
     * 小类
     */
    typeId: string;
    /**
     * 大类
     */
    mainTypeId: string;
    /**
     * 用户Id
     */
    userId: string;
    /**
     * 社区Id
     */
    communityId: string;
    /**
     * 内容
     */
    content: string;
    /**
     * 所需积分
     */
    points: number;
    /**
     * 排序
     */
    sort: number;
    /**
     * 状态
     */
    status: string;
}
export declare const ServiceTableName = "t_service";
