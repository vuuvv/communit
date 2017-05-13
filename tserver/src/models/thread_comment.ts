import { BaseModel } from './base_model';
import { property } from '../utils';

export class ThreadComment extends BaseModel {
  /**
   * 主题贴Id
   */
  @property()
  threadId: string;
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
   * 内容
   */
  @property()
  content: string;
}

export const ThreadCommentTableName = 't_thread_comment';

