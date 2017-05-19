import { BaseModel } from './base_model';
import { property } from '../utils';

export class Answer extends BaseModel {
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

  /**
   * 状态
   */
  status: string;

  /**
   * 订单Id
   */
  @property()
  orderId: string;

  /**
   * 最后一条answer_session插入的时间
   */
  @property()
  latestAnswerTime: Date;
}

export const AnswerTableName = 't_answer';
