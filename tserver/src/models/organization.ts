import { BaseModel } from './base_model';

export class Organization extends BaseModel {
  organizationname: string;
  description: string;
  background: string;
  rules: string;
  officer: string;
  skeleton: string;
  organtype: number;
  accountid: string;
}

export const OrganizationTableName = 't_organization';
