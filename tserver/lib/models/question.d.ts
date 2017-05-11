import { BaseModel } from './base_model';
export declare class Question extends BaseModel {
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
}
