import { BaseModel } from './base_model';
export declare class OrderDetail extends BaseModel {
    orderId: string;
    /**
     * 产品Id
     */
    productId: string;
    /**
     * 产品类型
     */
    type: string;
    /**
     * 买家Id
     */
    points: number;
    /**
     * 产品信息快照
     */
    data: string;
    /**
     * 数量
     */
    count: number;
}
export declare const OrderDetailTableName = "t_order_detail";
