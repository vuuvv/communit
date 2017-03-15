import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { Location } from '@angular/common';

import { Http } from '../shared';
import { OverlayService, DialogService } from '../../components';

@Component({
  templateUrl: './order-list.html',
  styleUrls: ['./order-list.less'],
  encapsulation: ViewEncapsulation.None,
})
export class OrderListComponent implements OnInit {
  transactions: any[];

  constructor(
    private http: Http,
    private router: Router,
    private route: ActivatedRoute,
    private overlayService: OverlayService,
    private dialogService: DialogService,
    private location: Location,
  ) {}

  ngOnInit() {
    this.overlayService.loading();
    this.http.get('/order/list').subscribe((value: any) => {
      this.overlayService.hideToast();
      this.transactions = value;
      this.transactions.forEach((v) => {
        if (v.order) {
          v.products = v.order.details.map((d) => JSON.parse(d.data));
        }
      });
    });
  }
}
