import { Injectable, isDevMode } from '@angular/core';

@Injectable()
export class UrlService {
  private baseUrl = isDevMode() ? 'http://weixin.vuuvv.com' : 'http://www.crowdnear.com/m';
}
