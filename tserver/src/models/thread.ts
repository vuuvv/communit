import { BaseModel } from './base_model';
import { property } from '../utils';

export class Thread extends BaseModel {
  /**
   * 社工机构Id
   */
  @property()
  organizationId: string;
  /**
   * 社区Id
   */
  @property()
  communityId: string;
  /**
   * 用户Id
   */
  @property()
  userId: string;
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
   * 图片
   */
  @property()
  images: string;
  /**
   * 赞的次数
   */
  @property()
  good: number;
  /**
   * 踩的次数
   */
  @property()
  bad: number;
  /**
   * 最后回帖时间
   */
  @property()
  lastCommentTime: string;
}

export const ThreadTableName = 't_thread';

