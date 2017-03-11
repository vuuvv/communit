import { BaseModel } from './base_model';
import { property } from '../utils';

export class Service extends BaseModel {
  /**
   * 类型Id
   */
  @property()
  categoryId: string;

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
   * 排序
   */
  @property()
  sort: number;
}

export const ServiceTableName = 't_service';
