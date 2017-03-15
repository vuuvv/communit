import { BaseModel } from './base_model';
import { property } from '../utils';

export class ServiceCategories {
  static Help: string = '33ef69e8e2cc4cf3a9f12c36b560ee73';
  static Custom: string = '8c4075759d914b1395b8b06bc1b5d19f';
  static Public: string = '09756aef0f3f43fbb64377baf313b43a';
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
