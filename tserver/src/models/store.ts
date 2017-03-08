import { BaseModel } from './base_model';
import { property } from '../utils';

export class Store extends BaseModel {
  /**
   * 所属用户Id
   */
  @property()
  userId: string;

  /**
   * 所属社区Id
   */
  @property()
  communityId: string;

  /**
   * 店铺状态, 审核中(submit), 正常运行(normal), 关闭(closed), 审核不通过(reject)
   */
  @property()
  status: string;

  /**
   * 店铺描述
   */
  @property()
  description: string;

  /**
   * 店铺地址
   */
  @property()
  address: string;

  /**
   * 联系方式
   */
  @property()
  tel: string;

  /**
   * 联系人
   */
  @property()
  contact: string;

  constructor() {
    super();
    this.status = 'submit';
  }
}

export const StoreTableName = 't_store';
