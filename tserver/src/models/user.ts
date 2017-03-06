import { BaseModel } from './base_model';
import { property } from '../utils';

export class User {
  @property()
  ID: string;
  @property()
  username: string;
  @property()
  name: string;
}

export const UserTableName = 't_s_base_user';
