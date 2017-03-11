import { BaseModel } from './base_model';
export declare class ServiceType extends BaseModel {
    /**
     *
     */
    categoryId: string;
    /**
     * 名称
     */
    name: string;
    /**
     * 图标地址
     */
    icon: string;
    /**
     * 排序
     */
    sort: number;
}
export declare const ServiceTypeTableName = "t_service_type";
