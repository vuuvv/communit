import { Component, Input } from '@angular/core';

@Component({
  selector: 'order-item',
  templateUrl: './order-item.component.html',
  styleUrls: ['./order-item.component.less'],
})
export class OrderItemComponent {
  @Input('orderItem') orderItem: any;
  @Input('type') type: string;

  constructor() {
  }

  get product() {
    if (!this.orderItem) {
      return {};
    }
    if (this.type === 'product') {
      return JSON.parse(this.orderItem.data);
    } else if (this.type === 'activity') {
      return this.orderItem.activity;
    } else if (this.type === 'service') {
      return JSON.parse(this.orderItem.content);
    }
  }

  test() {
    console.log(this.product);
  }
}
