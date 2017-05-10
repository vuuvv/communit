import { Injectable } from '@angular/core';
import { Router, NavigationExtras } from '@angular/router';

import { Observable } from '../../utils';


import { Http } from './http';
import { DialogService } from '../../../components';

export class Login {
  username: string;
  password: string;
  captcha: string;
}

@Injectable()
export class AuthorizeService {
  private communityId: string;
  userId: string;

  isLoggedIn: boolean = false;
  redirectUrl: string;
  user: any;

  constructor(private http: Http, private router: Router, private dialogService: DialogService) {
    console.log('authorize ctors');
  }

  private doLogin(user: any): any {
    let redirect = this.redirectUrl ? this.redirectUrl : '/';
    this.router.navigateByUrl(redirect);
    return user;
  }

  update(): Observable<any> {
    return this.http.get<any>('/user/me', undefined, undefined, undefined, 'none').map((user: any) => {
      this.isLoggedIn = true;
      this.user = user;
      this.communityId = user.user.communityId;
      this.userId = user.user.userId;
      return user;
    });
  }

  checkLogin(): Observable<boolean> {
    if (this.isLoggedIn) {
      return Observable.of(true);
    }
    return this.update().map((user: any) => {
      this.doLogin(user);
      return true;
    });
  }

  gotoSignup() {
    this.router.navigate(['/user/verify']);
  }

  getCommunityId() {
    return this.communityId ?
      Promise.resolve(this.communityId) :
      this.http.get('/user/community').toPromise().then((v: string) => {
        this.communityId = v;
        return v;
      });
  }
}
