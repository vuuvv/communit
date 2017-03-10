import { BaseModel } from './base_model';

export class OrganizationUser extends BaseModel {
  email: string;
  mobilePhone: string;
  officePhone: string;
  signatureFile: string;
  accountid: string;
  type: string;
  activitiSync: number;
  browser: string;
  password: string;
  realname: string;
  signature: string;
  status: string;
  userkey: string;
  username: string;
  organizationid: string;
  age: string;
  sex: string;
  education: string;
  company: string;
  resume: string;
  qualify: string;
  jobrequire: string;
  subuserid: string;
}

export const OrganizationUserTableName = 't_organuser';
