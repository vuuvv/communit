import { BaseModel } from './base_model';

export class Config extends BaseModel {
  key: string;
  value: string;
}

export const ConfigTableName = 't_config';
