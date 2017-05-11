import { BaseModel } from './base_model';
import { property } from '../utils';

export class Question extends BaseModel {
  /**
   * 大类
   */
  @property()
  mainTypeId: string;

  /**
   * 小类
   */
  @property()
  typeId: string;

  /**
   * 标题
   */
  @property()
  title: string;

  /**
   * 内容
   */
  @property()
  content: string;

  /**
   * 悬赏积分
   */
  @property()
  points: number;

}
