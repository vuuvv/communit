import { BaseModel } from './base_model';

export class User extends BaseModel {
  phone: string;
  name: string;
  area: string;
  address: string;
  avatar?: string;
  sex?: number;
}

export const UserTableName = 't_user';
