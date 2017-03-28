import { Injectable } from '@angular/core';
import { Http as RawHttp, Response, Headers, RequestOptions, RequestMethod, Request } from '@angular/http';
import { Router } from '@angular/router';

import { DialogService, OverlayService } from '../../../components';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';
import 'rxjs/add/observable/empty';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/concatMap';
import 'rxjs/add/operator/catch';

function fixUrl(url: string): string {
  const absoluteUrlPattern = new RegExp('^([a-z]+://|//)', 'i');
  let base = window['BASE_URL'];
  if (absoluteUrlPattern.test(url) || !base) {
    return url;
  }
  url = url.replace(/^\//, '');
  base = base.replace(/\/$/, '');
  return `${base}/${url}`;
}

export function buildQueryString(data: any) {
  if (!data) {
    return '';
  }
  return Object.keys(data).filter(
    value => data[value] !== undefined && data[value] !== null
  ).map(
    key => `${key}=${encodeURIComponent(data[key])}`
  ).join('&');
}

export function buildUrl(url: string, data: any = null, noCache = true) {
  url = fixUrl(url);

  if (!data) {
    data = {};
  }

  if (noCache) {
    data['_t'] = new Date().getTime();
  }

  let qs = buildQueryString(data);
  if (qs && url.indexOf('?') === -1) {
    url += '?';
  }

  return url + qs;
}

export class HttpError extends Error {
  code: string;

  constructor(resp: ApiResult<any>) {
    super();
    this.code = resp.code;
    this.message = `[${resp.code}]${resp.message || '错误'}`;
  }
}

export class PublickKey {
  pub: string;
}

export class EncryptParameter {
  e: string;
}

export class ApiResult<T> {
  code: string;
  value: T;
  message?: string;
}

export type ErrorTipType = 'none' | 'dialog' | 'toast';

@Injectable()
export class Http {
  constructor(
    private http: RawHttp,
    private dialog: DialogService,
    private overlayService: OverlayService,
    private router: Router) {
  }

  private errorHandler(err: any, errorTip: ErrorTipType = 'dialog') {
    console.error(err);
    let msg = '';
    if (err instanceof HttpError) {
      if (err.code === '100004') {
        this.overlayService.hideToast();
        this.router.navigate(['/user/verify']);
        return Observable.empty();
      }
      msg = err.message;
    } else if (err.status === 0) {
      msg = '无法连接服务器';
    } else if (err.status === 401) {
      msg = '用户未授权';
    } else {
      msg = err.toString();
    }
    switch (errorTip) {
      case 'dialog':
      case 'toast':
        this.dialog.alert(msg, '错误');
        return Observable.empty();
      default:
        break;
    }
    throw err;
  }

  private resultHanlder<T>(res: Response) {
    let ret = res.json() as ApiResult<T>;
    if (ret.code !== '0') {
      throw new HttpError(ret);
    }
    return ret.value;
  }

  private publickKey(data: any): Observable<EncryptParameter> {
    if (!data) {
      return Observable.of({e: ''});
    }
    return this._get<PublickKey>('pk').map(pk => {
        let plain = JSON.stringify(data);
        return { e: this.encrypt(plain, pk.pub) };
    });
  }

  private encrypt(plain: string, secret: string) {
    let parts = plain.match(/.{1,100}/g);
    let ret = [];

    let encrypt = new window['JSEncrypt']();
    encrypt.setPublicKey(secret);

    for (let i = 0; i < parts.length; i++) {
      ret.push(encrypt.encrypt(parts[i]));
    }
    return JSON.stringify(ret);
  }

  buildUrl(url: string, data: any = null, noCache = true) {
    return buildUrl(url, data, noCache);
  }

  private _get<T>(url: string, data: any = null, noCache = true, errorTip: ErrorTipType = 'dialog'): Observable<T> {
    url = buildUrl(url, data, noCache);
    return this.http.get(url, {withCredentials: true}).map(res => this.resultHanlder(res)).catch(err => this.errorHandler(err, errorTip));
  }

  get<T>(url: string, data: any = null, noCache = true, encrypt = false, errorTip: ErrorTipType = 'dialog'): Observable<T> {
    return encrypt ?
      this.publickKey(data).concatMap(value => this._get(url, value, noCache, errorTip)) :
      this._get(url, data, noCache, errorTip);
  }

  private _post<T>(url: string, data: any, errorTip: ErrorTipType = 'dialog'): Observable<T> {
    let headers = new Headers({ 'Content-Type': 'application/x-www-form-urlencoded' });
    let options = new RequestOptions({ headers: headers, withCredentials: true });
    let qs = buildQueryString(data);
    url = buildUrl(url, {}, false);
    return this.http.post(url, qs, options).map(res => this.resultHanlder(res)).catch(err => this.errorHandler(err, errorTip));
  }

  post<T>(url: string, data: any = null, encrypt = false, errorTip: ErrorTipType = 'dialog') {
    return encrypt ?
      this.publickKey(data).concatMap(value => this._post(url, value, errorTip)) :
      this._post(url, data, errorTip);
  }

  private _json<T>(url: string, data: any, errorTip: ErrorTipType = 'dialog'): Observable<T> {
    let headers = new Headers({ 'Content-Type': 'application/json' });
    url = buildUrl(url, {}, false);
    let options = new RequestOptions({
      method: RequestMethod.Post,
      url: url,
      headers: headers,
      body: JSON.stringify(data),
      withCredentials: true,
    });
    return this.http.request(new Request(options)).map(res => this.resultHanlder(res)).catch(err => this.errorHandler(err, errorTip));
  }

  json<T>(url: string, data: any = null, encrypt = false, errorTip: ErrorTipType = 'dialog') {
    return encrypt ?
      this.publickKey(data).concatMap(value => this._json(url, value, errorTip)) :
      this._json(url, data, errorTip);
  }
}
