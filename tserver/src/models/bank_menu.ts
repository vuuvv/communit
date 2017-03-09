import { BaseModel } from './base_model';
import { property } from '../utils';

export class BankMenu extends BaseModel {
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

  /**
   * 路径
   */
  @property()
  url?: string;

  /**
   * 排序
   */
  @property()
  sort: number;
}

export const BankMenuTableName = 't_bank_menu';
