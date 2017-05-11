import { BaseModel } from './base_model';
import { property } from '../utils';

export class Answer extends BaseModel {
  /**
   * 问题Id
   */
  @property()
  questionId: string;

  /**
   * 回答内容
   */
  @property()
  content: string;

  /**
   * 获得积分
   */
  @property()
  points: string;
}
