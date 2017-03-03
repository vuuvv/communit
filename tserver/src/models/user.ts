import { BaseModel } from './base_model';
import { property } from '../utils';

export class User extends BaseModel {
  @property()
  phone: string;
  @property()
  name: string;
  @property()
  area: string;
  @property()
  address: string;
  @property()
  avatar?: string;
  @property()
  sex?: number;
}

export const UserTableName = 't_user';
