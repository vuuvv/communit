import { BaseModel } from './base_model';
import { property } from '../utils';

export class Service extends BaseModel {
  /**
   * 种类Id
   */
  @property()
  categoryId: string;

  /**
   * 类型Id
   */
  @property()
  typeId: string;

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
   * json格式的内容, 根据服务类型所需的字段决定的
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
}

export const ServiceTableName = 't_service';
