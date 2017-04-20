import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Location } from '@angular/common';
import { ActivatedRoute, Params } from'@angular/router';
import { Router } from '@angular/router';

import { Http, FormService, AuthorizeService } from '../shared';
import { OverlayService, DialogService } from '../../components';

const validMessages = {
  points: {
    required: '请填写积分报价',
  },
};

@Component({
  templateUrl: './service-join.html',
  styleUrls: ['./service-join.less'],
  encapsulation: ViewEncapsulation.None,
})
export class ServiceJoinComponent implements OnInit {
  service;
  user: any = {};

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private overlayService: OverlayService,
    private formService: FormService,
    private http: Http,
    private authorizeService: AuthorizeService,
    private dialogService: DialogService,
    private location: Location,
  ) {}

  ngOnInit() {
    this.overlayService.loading();
    this.route.params.concatMap((params: Params) => {
      return this.http.get(`/service/item/${params['id']}`);
    }).subscribe((resp: any) => {
      this.overlayService.hideToast();
      this.service = resp.service;
      if (resp.user && resp.user.status && ['reject', 'quit'].indexOf(resp.user.status) === -1) {
        this.dialogService.alert('不可向同一服务发起重复报名');
        this.location.back();
        return;
      }
      if (this.service.userId === this.authorizeService.userId) {
        this.dialogService.alert('不可向自己发起的服务报名');
        this.location.back();
        return;
      }
    });
  }

  submit(form) {
    this.overlayService.loading();
    this.formService.submit(form, validMessages, `/service/${this.service.id}/join`, this.user).subscribe(() => {
      this.overlayService.toast();
      this.router.navigate([`/bank/service/${this.service.id}`]);
    });
  }
}
