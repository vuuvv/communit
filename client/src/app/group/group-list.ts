import { Component, OnInit, ViewEncapsulation } from '@angular/core';

import { Http } from '../shared';
import { OverlayService } from '../../components';

@Component({
  templateUrl: './group-list.html',
  styleUrls: ['./group-list.less'],
  encapsulation: ViewEncapsulation.None,
})
export class GroupListComponent implements OnInit {
  organizations: any[] = [];

  constructor(
    private http: Http,
    private overlayService: OverlayService,
  ) {}


  ngOnInit() {
    this.overlayService.loading();
    this.http.get('/organization/home').subscribe((value: any) => {
      this.overlayService.hideToast();
      this.organizations = value;
      this.organizations.forEach((v) => {
        v.children = JSON.parse(v.children);
      });
    });
  }
}
