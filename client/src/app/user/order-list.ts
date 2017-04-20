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
  orders: any[];
  tabs = ['公益服务订单', '超市购买订单'];
  types = {
    activity: 0,
    product: 2,
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
    this.overlayService.loading();
    this.route.params.concatMap((params: Params) => {
      this.type = params['type'];
      return this.http.get(`/order/list/${this.type}`);
    }).subscribe((value: any) => {
      this.overlayService.hideToast();
      if (!value) {
        this.orders = [];
        return;
      }
      this.orders = value;

      if (this.type === 'product') {
        this.orders.forEach((o) => {
          o.products = o.details.map((d) => JSON.parse(d.data));
        });
      }

      setTimeout(() => {
        this.currentIndex = this.types[this.type] || 0;
      }, 0);
    });
  }
}
