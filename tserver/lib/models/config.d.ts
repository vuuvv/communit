import { BaseModel } from './base_model';
export declare class Config extends BaseModel {
    key: string;
    value: string;
}
export declare const ConfigTableName = "t_config";
