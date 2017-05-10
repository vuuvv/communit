import { Injectable } from '@angular/core';
import { Router, CanActivate, CanActivateChild, NavigationExtras, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';

import { Observable } from 'rxjs/Observable';

import { AuthorizeService } from './authorize';

@Injectable()
export class AuthorizeGuard implements CanActivate, CanActivateChild {
  constructor(private authorize: AuthorizeService, private router: Router) {
  }

  private notLoginHandler(): Observable<boolean> {
    console.log('need login');
    this.authorize.gotoSignup();
    return Observable.of(false);
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
    this.authorize.redirectUrl = state.url;
    return this.authorize.checkLogin().catch((err) => this.notLoginHandler());
  }

  canActivateChild(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
    return this.canActivate(route, state);
  }
}
