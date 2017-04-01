import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, Params, Router } from'@angular/router';

import { Http } from '../shared';
import { OverlayService } from '../../components';

const ActivityUserStatus = {
  submit: '报名中',
  joined: '同意参加',
  reject: '不同意参加',
  payed: '已获得积分',
  refunded: '已退积分',
};

@Component({
  templateUrl: './activity.html',
})
export class ActivityComponent implements OnInit {
  activity: any;
  users: any[];
  me: any;

  constructor(
    private http: Http,
    private route: ActivatedRoute,
    private router: Router,
    private overlayService: OverlayService,
  ) {}

  ngOnInit() {
    this.overlayService.loading()
    this.route.params.concatMap((params: Params) => {
      return this.http.get(`/activity/item/${params['id']}`);
    }).subscribe((value: any) => {
      this.overlayService.hideToast();
      this.activity = value.activity;
      this.users = value.users;
      this.me = value.me;
    });
  }

  get canJoin() {
    return !this.me;
  }

  get canStart() {
    return this.me && this.activity && this.me.post === 'leader' && this.activity.status === 1;
  }

  get canCheck() {
    return this.me && this.activity && this.me.post === 'leader' && this.activity.status === 2;
  }

  getUserStatus(user) {
    if (user.status === 'payed') {
      return `已获得${user.points}积分`;
    }
    return ActivityUserStatus[user.status] || user.status;
  }

  join() {
    this.overlayService.loading();
    this.http.post(`/activity/join/${this.activity.id}`).subscribe((value) => {
      this.router.navigate([`/bank/activity/${this.activity.id}`, {t: new Date().getTime()}]);
    });
  }

  start() {
    this.overlayService.loading();
    this.http.post(`/activity/start/${this.activity.id}`).subscribe((value) => {
      this.router.navigate([`/bank/activity/${this.activity.id}`, {t: new Date().getTime()}]);
    });
  }

  check() {
    this.overlayService.loading();
    this.http.post(`/qr/g/activity/${this.activity.id}`).subscribe((value) => {
      this.overlayService.hideToast();
      this.router.navigate([`/user/qr/${value}`]);
    });
  }
}

