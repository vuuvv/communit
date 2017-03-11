import { BaseModel } from './base_model';
export declare class Service extends BaseModel {
    /**
     * 类型Id
     */
    categoryId: string;
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
     * 排序
     */
    sort: number;
}
export declare const ServiceTableName = "t_service";
