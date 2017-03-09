import { BaseModel } from './base_model';
export declare class BankMenu extends BaseModel {
    /**
     * 名称
     */
    name: string;
    /**
     * 父Id
     */
    parentId?: string;
    /**
     * 图标路径
     */
    icon?: string;
    /**
     * 路径
     */
    url?: string;
    /**
     * 排序
     */
    sort: number;
}
export declare const BankMenuTableName = "t_bank_menu";
