import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/forkJoin';

import { isEmptyArray, Http } from '../shared';
import { OverlayService } from '../../components';

@Component({
  templateUrl: './organization-detail.html',
})
export class OrganizationDetailComponent implements OnInit {
  organization: any;
  users: any[] = [];

  constructor(
    private http: Http,
    private route: ActivatedRoute,
    private overlayService: OverlayService,
  ) {}

  ngOnInit() {
    this.overlayService.loading();
    this.route.params.concatMap((params: Params) => {
      let id = params['id'];
      return Observable.forkJoin(
        this.http.get(`/organization/item/${id}`),
        this.http.get(`/organization/${id}/users`),
      );
    }).subscribe((values: any[]) => {
      this.overlayService.hideToast();
      this.organization = values[0];
      this.users = values[1];
    });
  }

  get hasUsers() {
    return !isEmptyArray(this.users);
  }
}
