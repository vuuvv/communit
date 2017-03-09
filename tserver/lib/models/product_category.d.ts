import { BaseModel } from './base_model';
export declare class ProductCategory extends BaseModel {
    /**
     * 名称
     */
    name: string;
    /**
     * 父Id
     */
    parentId?: string;
    /**
     * 图标路径
     */
    icon?: string;
}
export declare const ProductCategoryTableName = "t_product_category";
