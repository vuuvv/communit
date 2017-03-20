import { Component, OnInit } from '@angular/core';
import { Http } from '../shared';
import { OverlayService } from '../../components';

@Component({
  templateUrl: './user.html',
  styleUrls: ['./user.less'],
})
export class UserComponent implements OnInit {
  private user: any = {};
  private account: any;
  private store: any;

  constructor(
    private http: Http,
    private overlayService: OverlayService
  ) {
  }

  ngOnInit() {
    this.overlayService.loading();
    this.http.get('/user/me').subscribe((value: any) => {
      this.overlayService.hideToast();
      this.user = value.user;
      this.account = value.account;
      this.store = value.store;
    });
  }

  get publicPoints() {
    if (this.account && this.account.length) {
      for (let a of this.account) {
        if (a.name === '公益积分') {
          return a.balance;
        }
      }
    }
    return 0;
  }

  get buyPoints() {
    if (this.account && this.account.length) {
      for (let a of this.account) {
        if (a.name === '购买积分') {
          return a.balance;
        }
      }
    }
    return 0;
  }
}
