import { BaseModel } from './base_model';
import { property } from '../utils';

export class ProductCategory extends BaseModel {
  /**
   * 名称
   */
  @property()
  name: string;

  /**
   * 父Id
   */
  @property()
  parentId?: string;

  /**
   * 图标路径
   */
  @property()
  icon?: string;
}

export const ProductCategoryTableName = 't_product_category';
