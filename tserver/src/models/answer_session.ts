import { BaseModel } from './base_model';
import { property } from '../utils';

export class AnswerSession extends BaseModel {
  /**
   * 社区id
   */
  @property()
  communityId: string;

  /**
   * 用户Id
   */
  @property()
  userId: string;

  /**
   * 回答Id
   */
  @property()
  AnswerId: string;

  /**
   * 回答类型
   * 'text': 文本类型
   * 'price': 出价类型, 可进行确认操作
   */

  /**
   * 对于text类型, 回答内容
   */
  @property()
  content: string;


  /**
   * 对于price类型, 定价积分
   */
  @property()
  points: string;
}

export const AnswerSessionTableName = 't_answer_session';
