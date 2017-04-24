import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';

import { Http, AuthorizeService } from '../services';

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
  @Input() isStore = false;

  actions = {
    pay: '线下支付',
    refund: '退款',
    rank: '评价',
  };

  constructor(
    private http: Http,
    private overlayService: OverlayService,
    private router: Router,
    private authorizeService: AuthorizeService,
  ) {
  }

  getOrderStatus(o) {
    return OrderStatus[o.status] || o.status;
  }

  getProductCount(o) {
    if (o.type === 'product') {
      return o.details.reduce((a, v) => a + v.count, 0);
    }
    return 0;
  }

  getProductPoints(o) {
    if (o.type === 'product') {
      return o.details.reduce((a, v) => a + v.points, 0);
    }
    return 0;
  }

  getProductPrice(o) {
    if (o.type === 'product') {
      return o.details.reduce((a, v) => {
        let p = JSON.parse(v.data);
        return a + v.count * p.price;
      }, 0);
    }
    return 0;
  }

  getTitle(o) {
    if (o.type === 'activity') {
        return o.communityName;
    }
    return o.name;
  }

  getType() {
    if (this.order.type === 'activity') {
      return '公益活动';
    }
    return this.order.categoryName;
  }

  pay() {
    this.overlayService.loading();
    this.http.post(`/qr/g/order/${this.order.id}`).subscribe((v) => {
      this.overlayService.hideToast();
      this.router.navigate([`/user/qr/${v}`]);
    });
  }

  act(name) {
    let fn = this[name];
    if (fn) {
      fn.bind(this)();
    }
  }

  getActions() {
    let order = this.order;
    let currentUserId = this.authorizeService.userId;

    if (!order) {
      return [];
    }

    switch (order.type) {
      case 'product':
        if (order.status === 'payed') {
          // return ['reject', 'pay'];
          return ['pay'];
        } else if (order.status === 'done') {
          return ['rank'];
        }
        break;
      case 'service':
        if (this.authorizeService.userId === order.ownerId) {
          return [];
        }
        if (order.status === 'payed') {
          return ['pay'];
        } else if (order.status === 'done') {
          return ['rank'];
        }
        break;
    }

    return [];
  }
}
