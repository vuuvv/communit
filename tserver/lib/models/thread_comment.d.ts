import { BaseModel } from './base_model';
export declare class ThreadComment extends BaseModel {
    /**
     * 主题贴Id
     */
    threadId: string;
    /**
     * 社区Id
     */
    communityId: string;
    /**
     * 用户Id
     */
    userId: string;
    /**
     * 内容
     */
    content: string;
}
export declare const ThreadCommentTableName = "t_thread_comment";
