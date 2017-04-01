import { Component, Input } from '@angular/core';

@Component({
  selector: 'order-item',
  templateUrl: './order-item.component.html',
  styleUrls: ['./order-item.component.less'],
})
export class OrderItemComponent {
  @Input('orderItem') orderItem: any;

  constructor() {
  }

  get product() {
    if (!this.orderItem) {
      return null;
    }
    return JSON.parse(this.orderItem.data);
  }
}
