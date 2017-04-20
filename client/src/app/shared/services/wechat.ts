import { Injectable } from '@angular/core';
import { Http, buildUrl } from './http';
import { AuthorizeService } from './authorize';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/toPromise';

const wx = window['wx'];

@Injectable()
export class WechatService {
  private isConfiged = false;
  private error;

  constructor(
    private http: Http,
    private authorizeService: AuthorizeService,
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

  chooseImage(count = 1): Promise<string[]> {
    return new Promise<string[]>((resolve, reject) => {
      this.config().then(() => {
        wx.chooseImage({
          count: count,
          success: function (res) {
            resolve(res.localIds);
          }
        });
      });
    });
  }

  uploadImage(localId: string) {
    return new Promise<string>((resolve, reject) => {
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

  previewUrl(serverId: string) {
    return Promise.resolve(/^https?:\/\/|^\/\//i.test(serverId)).then((isUrl) => {
      if (isUrl) {
        return serverId;
      } else {
        return this.authorizeService.getCommunityId().then((communityId) => {
          return buildUrl(`/wechat/preview/${communityId}/${serverId}`, undefined, false);
        });
      }
    });
  }

  previewImage(serverIds: string[], index = 0, fixUrl = true) {
    if (!serverIds || !serverIds.length) {
      return;
    }
    let current = serverIds[index];
    if (!current) {
      current = serverIds[0];
    }

    let a = [this.previewUrl(current)];
    a = a.concat(serverIds.map((id) => this.previewUrl(id)));

    Promise.all(a).then((values: any[]) => {
      console.log(values);
      wx.previewImage({
        current: fixUrl ? values[0] : current,
        urls: fixUrl ? values.slice(1) : serverIds.slice(1),
      });
    });
  }
}
