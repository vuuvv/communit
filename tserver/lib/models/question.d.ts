import { BaseModel } from './base_model';
export declare class Question extends BaseModel {
    /**
     * 社区id
     */
    communityId: string;
    /**
     * 用户Id
     */
    userId: string;
    /**
     * 分类, question 问答, help 求助, service 服务
     */
    category: string;
    /**
     * 大类
     */
    mainTypeId: string;
    /**
     * 小类
     */
    typeId: string;
    /**
     * 标题
     */
    title: string;
    /**
     * 内容
     */
    content: string;
    /**
     * 悬赏积分
     */
    points: number;
    /**
     * 已悬赏积分
     */
    payedPoints: number;
    /**
     * 订单Id
     */
    orderId: string;
    /**
     * 状态
     */
    status: string;
    latestAnswerTime: Date;
}
export declare const QuestionTableName = "t_question";
