import { BaseModel } from './base_model';
import { property } from '../utils';

export class Product extends BaseModel {
  /**
   * 所属店铺Id
   */
  @property()
  storeId: string;

  /**
   * 所属种类Id
   */
  @property()
  categoryId: string;

  /**
   * 状态, 审核中(submit), 正常(online), 已下架(offline), 审核不通过(reject)
   */
  @property()
  status: string;

  @property()
  title: string;

  /**
   * 描述
   */
  @property()
  description: string;

  /**
   * 积分产品价格(元)
   */
  @property()
  price: number;

  /**
   * 积分产品价格(所需积分)
   */
  @property()
  points: number;

  /**
   * 原始价格
   */
  @property()
  normalPrice: number;

  /**
   * 销量
   */
  sales: number = 0;

  /**
   * 库存
   */
  stock: number = 0;

  /**
   * 评价
   */
  rank: number = 0;

  constructor() {
    super();
    this.status = 'submit';
  }
}

export const ProductTableName = 't_product';
