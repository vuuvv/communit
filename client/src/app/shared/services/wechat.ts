let wx = require('weixin-js-sdk');

import { Injectable } from '@angular/core';
import 'rxjs/add/operator/toPromise';

import { Http } from './http';

@Injectable()
export class WechatService {
  wx: any;

  constructor(
    private http: Http,
  ) {}

  get(): Promise<any> {
    return this.http.json('/wechat/signature', {
      url: window.location.href.split('#')[0],
    }).toPromise().then((value) => {
      return this.ready(value);
    });
  }

  ready(wechat): Promise<any> {
    return new Promise((resolve, reject) => {
      wx.config({
        debug: true,
        appId: wechat.appId,
        timestamp: wechat.timestamp,
        nonceStr: wechat.nonceStr,
        signature: wechat.signature,
        jsApiList: [
          'scanQRCode',
          'chooseImage',
          'previewImage',
          'uploadImage',
          'downloadImage',
          'getLocalImgData',
        ]
      });
      wx.ready(() => {
        resolve(wx);
      });
    });
  }
}
