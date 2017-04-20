import { BaseModel } from './base_model';
export declare class Service extends BaseModel {
    /**
     * 种类Id
     */
    categoryId: string;
    /**
     * 类型Id
     */
    typeId: string;
    /**
     * 用户Id
     */
    userId: string;
    /**
     * 社区Id
     */
    communityId: string;
    /**
     * json格式的内容, 根据服务类型所需的字段决定的
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
