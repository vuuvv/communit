import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { Location } from '@angular/common';

import { isEmptyArray, Http } from '../shared';
import { DialogService, OverlayService } from '../../components';

@Component({
  templateUrl: './worker-add.html',
})
export class WorkerAddComponent implements OnInit {
  user: any = {};
  organizationId: string;

  constructor(
    private http: Http,
    private route: ActivatedRoute,
    private dialogService: DialogService,
    private location: Location,
    private overlayService: OverlayService,
  ) {}

  ngOnInit() {
    this.overlayService.loading();
    this.route.params.concatMap((params: Params) => {
      this.organizationId = params['id'];
      return this.http.get(`/organization/joined/${this.organizationId}`);
    }).subscribe((user) => {
      this.overlayService.hideToast();
      if (user) {
        this.dialogService.alert('您已经加入该机构，或已提交申请, 请勿重复提交').ok((comp) => {
          this.location.back();
          comp.close();
        });
        return;
      }
    });
  }

  submit() {
    this.overlayService.loading();
    this.http.json(`/organization/join/${this.organizationId}`, this.user).subscribe(() => {
      this.overlayService.hideToast();
      this.location.back();
    });
  }
}
