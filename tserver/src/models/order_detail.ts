import { BaseModel } from './base_model';
import { property } from '../utils';

export class OrderDetail extends BaseModel {
  @property()
  orderId: string;
  /**
   * 产品Id
   */
  @property()
  productId: string;

  /**
   * 产品类型
   */
  @property()
  type: string;

  /**
   * 买家Id
   */
  @property()
  points: number;

  /**
   * 产品信息快照
   */
  @property()
  data: string;

  /**
   * 数量
   */
  @property()
  count: number;
}

export const OrderDetailTableName = 't_order_detail';
