import { BaseModel } from './base_model';
import { property } from '../utils';

export class ServiceCategory extends BaseModel {
  /**
   * 名称
   */
  @property()
  name: string;

  /**
   * 标签
   */
  @property()
  label: string;

  /**
   * 新增该类服务所需的字段, json的数组格式
   */
  @property()
  fields: string;
}

export const ServiceCategoryTableName = 't_service_category';
