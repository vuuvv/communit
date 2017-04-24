import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';

import { isEmptyArray, Http } from '../shared';

import { OverlayService, DialogService } from '../../components';

import { Observable } from 'rxjs/Observable';

@Component({
  templateUrl: './service-users.html',
  styleUrls: ['./service-users.less'],
  encapsulation: ViewEncapsulation.None,
})
export class ServiceUsersComponent implements OnInit {
  tabs = ['报名中', '已确认', '已完成'];
  names = ['submit', 'accept', 'done'];
  currentIndex = 0;
  serviceId;
  type;
  users: any[] = [];
  checkedUsers = {};

  constructor(
    private route: ActivatedRoute,
    private http: Http,
    private dialogService: DialogService,
    private OverlayService: OverlayService,
  ) {}

  ngOnInit() {
    this.init();
  }

  init() {
    this.route.params.concatMap((params: Params) => {
      this.serviceId = params['id'];
      this.type = params['type'];
      return this.http.get(`/service/${this.serviceId}/users/${this.names[this.type]}`);
    }).subscribe((value: any) => {
      this.users = value;
    });
  }

  check(ev, id, name) {
    if (ev.target.checked) {
      this.checkedUsers[id] = name;
    } else {
      delete this.checkedUsers[id];
    }
  }

  get hasChecked() {
    return !!Object.keys(this.checkedUsers).length;
  }

  action(name, desc) {
    let users = Object.keys(this.checkedUsers);
    if (!users.length) {
      this.dialogService.alert('请先选择报价用户');
      return;
    }
    this.dialogService.confirm(`确认${desc}这些用户的报价`).ok((comp) => {
      comp.close();
      this.OverlayService.loading();
      this.http.json(`/service/${this.serviceId}/${name}`, users).subscribe(() => {
        this.OverlayService.hideToast();
        this.checkedUsers = {};
        this.init();
      });
    });

  }

  accept() {
    this.action('accept', '接受');
  }

  reject() {
    this.action('reject', '拒绝');
  }
}
