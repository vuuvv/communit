import { BaseModel } from './base_model';
import { property } from '../utils';

export class ServiceUser extends BaseModel {
  /**
   * 服务Id
   */

  @property()
  serviceId: string;

  /**
   * 社区Id
   */
  @property()
  communityId: string;

  /**
   * 用户Id
   */
  @property()
  userId: string;

  /**
   * 'submit': 提交出价
   * 'reject': 用户拒绝该出价
   * 'accept': 用户接受该出价
   * 'done': 交易已完成
   *
   */
  @property()
  status: string;

  /**
   * 愿出积分
   */
  @property()
  points: number;

  /**
   * 描述
   */
  @property()
  description: string;

  /**
   * 交易订单Id
   */
  @property()
  orderId: string;

  /**
   * 实付积分
   */
  @property()
  payedPoints: string;

  /**
   * 拒绝原因
   */
  @property()
  rejectDescription: string;
}

export const ServiceUserTableName = 't_service_user';
