import { BaseModel } from './base_model';
export declare class ServiceType extends BaseModel {
    /**
     * 名称
     */
    name: string;
    /**
     * 标签
     */
    icon: string;
}
export declare const ServiceCategoryTableName = "t_service_type";
