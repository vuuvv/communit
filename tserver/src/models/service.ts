import { BaseModel } from './base_model';
import { property } from '../utils';

export class Service extends BaseModel {
  /**
   * 种类Id
   */
  @property()
  categoryId: string;

  /**
   * 小类
   */
  @property()
  typeId: string;

  /**
   * 大类
   */
  @property()
  mainTypeId: string;

  /**
   * 用户Id
   */
  @property()
  userId: string;

  /**
   * 社区Id
   */
  @property()
  communityId: string;

  /**
   * 内容
   */
  @property()
  content: string;

  /**
   * 所需积分
   */
  @property()
  points: number;

  /**
   * 排序
   */
  @property()
  sort: number;

  /**
   * 状态
   */
  @property()
  status: string;

}

export const ServiceTableName = 't_service';
