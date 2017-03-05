import { Component, Input, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'product-list-item',
  templateUrl: './product-list-item.html',
  styleUrls: ['./product-list-item.less'],
  encapsulation: ViewEncapsulation.None,
})
export class ProductListItemComponent {
  @Input() icon: string;
  @Input() title: string;
  @Input() desc: string;
  @Input() credit: number;
  @Input() realPrice: number;
  @Input() price: number;

  get src() {
    if (this.icon) {
      return `assets/images/ios/@2x/${this.icon}@2x.png`;
    } else {
      return null;
    }
  }
}
