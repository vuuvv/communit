import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';

import { isEmptyArray, Http } from '../shared';
import { OverlayService } from '../../components';

@Component({
  templateUrl: './organization.html',
  styleUrls: ['./organization.less'],
  encapsulation: ViewEncapsulation.None,
})
export class OrganizationComponent implements OnInit {
  organizations: any[];
  organization: any;
  id: any;

  constructor(
    private http: Http,
    private route: ActivatedRoute,
    private router: Router,
    private overlayService: OverlayService,
  ) {}

  ngOnInit() {
    this.overlayService.loading();
    this.route.params.concatMap((params: Params) => {
      this.id = params['id'];
      if (this.id) {
        return this.http.get(`/organization/children/${this.id}`);
      } else {
        return this.http.get(`/organization/home`);
      }
    }).subscribe((resp: any) => {
      this.overlayService.hideToast();
      if (this.id) {
        this.organization = resp.organization;
        this.organizations = resp.children;
      } else {
        this.organizations = resp;
        this.organizations.forEach((v) => {
          v.children = JSON.parse(v.children);
          if (v.children) {
            v.children.forEach((c) => {
              c.url = `/organization/children/${c.id}`;
            });
          };
        });
      }
    });
  }

  get title() {
    return this.organization ? this.organization.organizationname : '社工参与';
  }

  goto(org) {
    this.overlayService.loading();
    let id = org.id;
    if (org.organizationname.startsWith('其它')) {
      this.router.navigate(['/bank/worker', {id: id}]);
      return;
    }
    this.http.get(`/organization/children/${id}`).subscribe((v: any) => {
      if (v.children && v.children.length) {
        this.router.navigate(['/bank/worker', {id: id}]);
      } else {
        this.router.navigate([`/bank/organization/detail/${id}`]);
      }
    });
  }
}
