import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';

import { isEmptyArray, Http } from '../shared';

import { OverlayService } from '../../components';

import { Observable } from 'rxjs/Observable';

@Component({
  templateUrl: './service-users.html',
})
export class ServiceUsersComponent implements OnInit {
  tabs = ['报名中', '已确认', '已完成'];
  names = ['submit', 'accept', 'done'];
  currentIndex = 0;
  serviceId;
  type;
  users: any[] = [];

  constructor(
    private route: ActivatedRoute,
    private http: Http,
  ) {}

  ngOnInit() {
    this.route.params.concatMap((params: Params) => {
      this.serviceId = params['id'];
      this.type = params['type'];
      return this.http.get(`/service/${this.serviceId}/users/${this.names[this.type]}`);
    }).subscribe((value: any) => {
      this.users = value;
    });
  }
}
