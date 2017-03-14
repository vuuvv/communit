import { BaseModel } from './base_model';
import { property } from '../utils';

export class Carousel {
  @property()
  ID: string;
  @property()
  ACCOUNTID: string;
  @property()
  CREATE_BY: string;
  @property()
  CREATE_DATE: number;
  @property()
  CREATE_NAME: string;
  @property()
  IMAGE_HREF: string;
  @property()
  IMAGE_NAME: string;
  @property()
  TITLE: string;

}

export const CarouselTableName = 'weixin_cms_ad';
