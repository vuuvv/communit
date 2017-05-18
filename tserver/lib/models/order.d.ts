import { BaseModel } from './base_model';
export declare class OrderType {
    static Product: string;
    static Service: string;
    static Activity: string;
    static Answer: string;
    static Help: string;
}
export declare class OrderStatus {
    static Payed: string;
    static Done: string;
    static Refund: string;
}
export declare class Order extends BaseModel {
    type: string;
    communityId: string;
    /**
     * 买家Id
     */
    buyerId: string;
    /**
     * 商家Id
     */
    sellerId: string;
    /**
     * 订单金额
     */
    amount: number;
    /**
     * 订单状态, 'done': 已完成, 'refund': 已退款
     */
    status: string;
    /**
     * 下单时间
     */
    orderTime: Date;
    /**
     * 买家付款时间
     */
    payTime: Date;
    /**
     * 交易时间
     */
    tradeTime: Date;
    /**
     * 退款时间
     */
    refundTime: Date;
    /**
     * 下单预付费交易, 只有扣钱, 没有收钱
     */
    orderTransactionId: string;
    /**
     * 退预付费交易
     */
    orderRefundTransactionId: string;
    /**
     * 买家付款交易
     */
    buyerTradeTransactionId: string;
    /**
     * 卖家收款交易
     */
    sellerTradeTransactionId: string;
    /**
     * 买家退款交易
     */
    buyerRefundTransactionId: string;
    /**
     * 卖家退款交易
     */
    sellerRefundTransactionId: string;
}
export declare const OrderTableName = "t_order";
