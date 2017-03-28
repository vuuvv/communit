import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/forkJoin';

import { Http } from '../shared';
import { InputBase, InputSelect, InputText, OverlayService } from '../../components';

@Component({
  templateUrl: './activity.html',
})
export class ActivityComponent implements OnInit {
  organizations: any[];
  activity: any = {};

  constructor(
    private http: Http,
    private router: Router,
    private overlayService: OverlayService,
  ) {}

  ngOnInit() {
    this.overlayService.loading();
    this.http.get('/user/organizations').subscribe((value: any) => {
      this.overlayService.hideToast();
      this.organizations = value;
      this.activity.organizationId = this.organizations[0];
    });
  }

  submit() {
    this.overlayService.loading();
    this.activity.ifspot = !!this.activity.ifspot;
    this.http.json(`/activity/add`, this.activity).subscribe(() => {
      this.overlayService.toast('操作成功');
      this.router.navigate(['/bank/activities']);
    });
  }
}
