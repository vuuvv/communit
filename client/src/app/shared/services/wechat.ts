import { Injectable } from '@angular/core';
import { Http, buildUrl } from './http';

import { Observable } from 'rxjs/Observable';

const wx = window['wx'];

@Injectable()
export class WechatService {
  private isConfiged = false;
  private error;

  constructor(
    private http: Http,
  ) {}

  config(debug = true) {
    if (this.isConfiged) {
      return Promise.resolve();
    }
    this.error = null;
    let location = window.location;
    this.http.json('/wechat/signature/jsapi', {
      url: `${location.protocol}//${location.host}${location.pathname}`,
    }).subscribe((value: any) => {
      value.debug = false;
      value.jsApiList = [
        'chooseImage',
        'previewImage',
        'uploadImage',
        'downloadImage',
      ];
      wx.config(value);
    });
    return new Promise((resolve, reject) => {
      wx.ready(() => {
        if (this.error) {
          reject(this.error);
          return;
        }
        this.isConfiged = true;
        this.error = null;
        resolve();
      });
      wx.error((res) => {
        this.isConfiged = false;
        this.error = res;
        reject(res);
      });
    });
  }

  chooseImage(): Promise<string[]> {
    return new Promise((resolve, reject) => {
      this.config().then(() => {
        wx.chooseImage({
          count: 1,
          success: function (res) {
            resolve(res.localIds);
          }
        });
      });
    });
  }

  uploadImage(localId: string) {
    return new Promise((resolve, reject) => {
      this.config().then(() => {
        wx.uploadImage({
          localId: localId,
          isShowProgressTips: 1,
          success: function (res) {
            if (res.errMsg === 'uploadImage:ok') {
              resolve(res.serverId);
            } else {
              reject(res.errMsg);
            }
          }
        });
      });
    });
  }

  getCommunityId() {
    return this.http.get('/user/community');
  }

  previewUrl(communityId: string, serverId: string) {
    return buildUrl(`/wechat/preview/${communityId}/${serverId}`);
  }

  previewImage(serverIds: string[], communityId?: string) {
    if (!serverIds || !serverIds.length) {
      return;
    }
    return this.config().then(() => {
      Observable.of(communityId).concatMap((v) => {
        if (v) {
          return Observable.of(v);
        }
        return this.getCommunityId();
      }).subscribe((v: string) => {
        wx.previewImage({
          current: this.previewUrl(v, serverIds[0]),
          urls: serverIds.map((id) => this.previewUrl(v, id)),
        });
      });
    });
  }
}
