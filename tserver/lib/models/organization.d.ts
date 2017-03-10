import { BaseModel } from './base_model';
export declare class Organization extends BaseModel {
    organizationname: string;
    description: string;
    background: string;
    rules: string;
    officer: string;
    skeleton: string;
    organtype: number;
    accountid: string;
}
export declare const OrganizationTableName = "t_organization";
