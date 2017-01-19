import { Injectable } from '@angular/core';
import { Router, NavigationExtras } from '@angular/router';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/map';

import { Http } from './http';
import { DialogService } from '../../../components';

import { User } from '../models';

export class Login {
  username: string;
  password: string;
  captcha: string;
}

@Injectable()
export class AuthorizeService {
  isLoggedIn: boolean = false;
  redirectUrl: string;
  user: User;

  constructor(private http: Http, private router: Router, private dialogService: DialogService) {
    console.log('authorize ctors');
  }

  private doLogin(user: User): User {
    let redirect = this.redirectUrl ? this.redirectUrl : '/community';
    this.router.navigateByUrl(redirect);
    return user;
  }

  login(data: Login): Observable<User> {
    return this.http.post<User>('mo/login', data, true).concatMap((user: User) => {
      this.doLogin(user)
      return this.update();
    });
  }

  logout(): Observable<any> {
    return this.http.get('mo/logout').map(() => {
      this.isLoggedIn = false;
      this.user = null;
    });
  }

  update(): Observable<User> {
    return this.http.get<User>('/me', undefined, undefined, undefined, 'none').map((user: User) => {
      this.isLoggedIn = true
      this.user = user;
      return user;
    });
  }

  checkLogin(): Observable<boolean> {
    if (this.isLoggedIn) {
      return Observable.of(true);
    }
    return this.update().map((user: User) => {
      this.doLogin(user);
      return true;
    });
  }
}
