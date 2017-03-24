import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';

import { isEmptyArray, Http } from '../shared';
import { OverlayService } from '../../components';

const types = {
  1: '社工机构',
  2: '社团组织',
  3: '专业社工',
};

@Component({
  templateUrl: './organization.html',
})
export class OrganizationComponent implements OnInit {
  organizations: any[] = [];
  type: string = '1';

  constructor(
    private http: Http,
    private route: ActivatedRoute,
    private overlayService: OverlayService,
  ) {}

  ngOnInit() {
    this.overlayService.loading();
    this.route.params.concatMap((params: Params) => {
      this.type = params['id'];
      return this.http.get(`/organization/type/${this.type}`);
    }).subscribe((resp: any) => {
      this.overlayService.hideToast();
      this.organizations = resp;
    });
  }

  get typeName() {
    return types[this.type];
  }
}
