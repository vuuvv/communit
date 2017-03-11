import { BaseModel } from './base_model';
import { property } from '../utils';

export class ServiceType extends BaseModel {
  /**
   * 名称
   */
  @property()
  name: string;

  /**
   * 标签
   */
  @property()
  icon: string;
}

export const ServiceCategoryTableName = 't_service_type';
