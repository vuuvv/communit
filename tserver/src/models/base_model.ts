import { property } from '../utils';

export class BaseModel {
  @property()
  id: number;
  @property('created_at')
  createdAt: Date;
  @property('updated_at')
  updatedAt: Date;
}
