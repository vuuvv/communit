import { BaseModel } from './base_model';
export declare class ServiceCategories {
    static Custom: string;
    static Help: string;
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
