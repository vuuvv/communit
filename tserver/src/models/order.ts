import { BaseModel } from './base_model';
import { property } from '../utils';

export class OrderType {
  static Product = 'product';
  static Service = 'service';
  static Activity = 'activity';
}

export class OrderStatus {
  static Payed = 'payed';
  static Done = 'done';
  static Refund = 'refund';
}

export class Order extends BaseModel {
  @property()
  type: string;
  @property()
  communityId: string;
  /**
   * 买家Id
   */
  @property()
  buyerId: string;
  /**
   * 商家Id
   */
  @property()
  sellerId: string;
  /**
   * 订单金额
   */
  @property()
  amount: number;
  /**
   * 订单状态, 'done': 已完成, 'reject': 已退款
   */
  @property()
  status: string;
  /**
   * 下单时间
   */
  @property()
  orderTime: Date;
  /**
   * 买家付款时间
   */
  @property()
  payTime: Date;
  /**
   * 交易时间
   */
  @property()
  tradeTime: Date;
  /**
   * 退款时间
   */
  @property()
  refundTime: Date;
  /**
   * 下单预付费交易, 只有扣钱, 没有收钱
   */
  @property()
  orderTransactionId: string;
  /**
   * 退预付费交易
   */
  @property()
  orderRefundTransactionId: string;
  /**
   * 买家付款交易
   */
  @property()
  buyerTradeTransactionId: string;
  /**
   * 卖家收款交易
   */
  @property()
  sellerTradeTransactionId: string;
  /**
   * 买家退款交易
   */
  @property()
  buyerRefundTransactionId: string;
  /**
   * 卖家退款交易
   */
  @property()
  sellerRefundTransactionId: string;
}

export const OrderTableName = 't_order';
