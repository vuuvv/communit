import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';

import { Http } from '../services';

import { OverlayService } from '../../../components';

const OrderStatus = {
  payed: '已付积分, 需线下结算',
  done: '已完成',
};

@Component({
  selector: 'order',
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.less'],
})
export class OrderComponent {
  @Input('order') order: any;

  constructor(
    private http: Http,
    private overlayService: OverlayService,
    private router: Router,
  ) {
  }

  getOrderStatus(o) {
    return OrderStatus[o.status] || o.status;
  }

  getProductCount(o) {
    if (o) {
      return o.details.reduce((a, v) => a + v.count, 0);
    }
    return 0;
  }

  getProductPoints(o) {
    if (o) {
      return o.details.reduce((a, v) => a + v.points, 0);
    }
    return 0;
  }

  getProductPrice(o) {
    if (o) {
      return o.details.reduce((a, v) => {
        let p = JSON.parse(v.data);
        return a + v.count * p.price;
      }, 0);
    }
    return 0;
  }

  pay() {
    this.overlayService.loading();
    this.http.post(`/qr/g/order/${this.order.id}`).subscribe((v) => {
      this.overlayService.hideToast();
      this.router.navigate([`/user/qr/${v}`]);
    });
  }
}
