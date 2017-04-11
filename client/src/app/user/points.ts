import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { Location } from '@angular/common';

import { Http } from '../shared';
import { OverlayService, DialogService } from '../../components';

@Component({
  templateUrl: './points.html',
  styleUrls: ['./points.less'],
  encapsulation: ViewEncapsulation.None,
})
export class PointsComponent implements OnInit {
  account;
  tabs = ['公益购买积分', '公益购买积分'];
  currentIndex;

  constructor(
    private http: Http,
    private router: Router,
    private route: ActivatedRoute,
    private overlayService: OverlayService,
    private dialogService: DialogService,
    private location: Location,
  ) {}

  ngOnInit() {
    this.http.get('/account/summary').subscribe((value) => {
      this.account = value;
    });
    setTimeout(() => {
      this.currentIndex = 0;
    }, 0);
  }
}
