import { BaseModel } from './base_model';
import { property } from '../utils';

export class Question extends BaseModel {
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

  /**
   * 已悬赏积分
   */
  @property()
  payedPoints: number;

  /**
   * 订单Id
   */
  @property()
  orderId: string;

  /**
   * 状态
   */
  @property()
  status: string;
}

export const QuestionTableName = 't_question';
