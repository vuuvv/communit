import { BaseModel } from './base_model';
import { property } from '../utils';

export class ServiceType extends BaseModel {
  /**
   *
   */
  @property()
  categoryId: string;

  /**
   * 名称
   */
  @property()
  name: string;

  /**
   * 图标地址
   */
  @property()
  icon: string;

  /**
   * 排序
   */
  @property()
  sort: number;
}

export const ServiceTypeTableName = 't_service_type';
