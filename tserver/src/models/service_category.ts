import { BaseModel } from './base_model';
import { property } from '../utils';

export class ServiceCategories {
  static Custom: string = '33ef69e8e2cc4cf3a9f12c36b560ee73';
  static Help: string = '8c4075759d914b1395b8b06bc1b5d19f';
}

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
