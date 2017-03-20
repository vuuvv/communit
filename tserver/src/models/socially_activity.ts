import { BaseModel } from './base_model';
import { property } from '../utils';

export class SociallyActivity {
  @property()
  id: number;

  @property()
  creator: string;

  @property()
  createdat: Date;

  @property()
  updator: string;

  @property()
  updatedat: Date;

  @property()
  content: string;

  @property()
  holdtime: string;

  @property()
  holdaddress: string;

  @property()
  ifspot: string;

  @property()
  serviceobject: string;

  @property()
  accountid: string;

  @property()
  status: number;

  @property()
  integral: number;

  @property()
  auditstatus: number;

  @property()
  approvalstatus: string;

  @property()
  limitNum: string;

  @property()
  preIntegral: string;
}

export const SociallyActivityTableName = 't_socially_activity';
