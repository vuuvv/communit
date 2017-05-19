import { BaseModel } from './base_model';
export declare class ServiceCategories {
    static Service: string;
    static Help: string;
    static Question: string;
}
export declare class ServiceCategory extends BaseModel {
    /**
     * 名称
     */
    name: string;
    /**
     * 标签
     */
    label: string;
    /**
     * 新增该类服务所需的字段, json的数组格式
     */
    fields: string;
}
export declare const ServiceCategoryTableName = "t_service_category";
