import { BaseModel } from './base_model';
export declare class Product extends BaseModel {
    /**
     * 所属店铺Id
     */
    storeId: string;
    /**
     * 所属种类Id
     */
    categoryId: string;
    /**
     * 状态, 审核中(submit), 正常(online), 已下架(offline), 审核不通过(reject)
     */
    status: string;
    title: string;
    /**
     * 描述
     */
    description: string;
    /**
     * 积分产品价格(元)
     */
    price: number;
    /**
     * 积分产品价格(所需积分)
     */
    points: number;
    /**
     * 原始价格
     */
    normalPrice: number;
    /**
     * 销量
     */
    sales: number;
    /**
     * 库存
     */
    stock: number;
    /**
     * 评价
     */
    rank: number;
    constructor();
}
export declare const ProductTableName = "t_product";
