import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, Params } from'@angular/router';

import { Http } from '../shared';
import { OverlayService } from '../../components';

@Component({
  templateUrl: './activity-list.html',
  encapsulation: ViewEncapsulation.None,
})
export class ActivityListComponent implements OnInit {
  activities: any[];

  constructor(
    private http: Http,
    private route: ActivatedRoute,
    private overlayService: OverlayService,
  ) {}

  ngOnInit() {
    this.overlayService.loading();
    this.http.get('/activity/search').subscribe((value: any) => {
      this.overlayService.hideToast();
      this.activities = value;
    });
  }
}
