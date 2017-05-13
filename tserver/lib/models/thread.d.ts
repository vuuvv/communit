import { BaseModel } from './base_model';
export declare class Thread extends BaseModel {
    /**
     * 社工机构Id
     */
    organizationId: string;
    /**
     * 社区Id
     */
    communityId: string;
    /**
     * 用户Id
     */
    userId: string;
    /**
     * 标题
     */
    title: string;
    /**
     * 内容
     */
    content: string;
    /**
     * 图片
     */
    images: string;
    /**
     * 赞的次数
     */
    good: number;
    /**
     * 踩的次数
     */
    bad: number;
    /**
     * 最后回帖时间
     */
    lastCommentTime: string;
}
export declare const ThreadTableName = "t_thread";
