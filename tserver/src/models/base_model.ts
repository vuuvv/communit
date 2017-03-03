import { property } from '../utils';
import * as uuid from 'uuid/v4';

export class BaseModel {
  @property()
  id: string = uuid().replace(/-/g, '');
  @property('created_at')
  createdAt: Date;
  @property('updated_at')
  updatedAt: Date;
}
