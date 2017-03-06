import { property } from '../utils';
import { uuid } from '../utils';

export class BaseModel {
  @property()
  id: string = uuid();
  @property('created_at')
  createdAt: Date;
  @property('updated_at')
  updatedAt: Date;
}
