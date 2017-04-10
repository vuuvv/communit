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
  orders: any[];
  tabs = ['公益购买积分', '公益购买积分'];
  types = {
    activity: 0,
    buy: 1,
  };
  type = '';
  currentIndex = 0;

  constructor(
    private http: Http,
    private router: Router,
    private route: ActivatedRoute,
    private overlayService: OverlayService,
    private dialogService: DialogService,
    private location: Location,
  ) {}

  ngOnInit() {
  }
}
