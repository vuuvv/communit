import { Component, Input, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'product-list-item',
  templateUrl: './product-list-item.html',
  styleUrls: ['./product-list-item.less'],
  encapsulation: ViewEncapsulation.None,
})
export class ProductListItemComponent {
  @Input() product: any;

  get src() {
    let icon: string = this.product.categoryIcon;
    if (!icon) {
      return null;
    }

    if (icon.startsWith('http://')) {
      return icon;
    }
    return `assets/images/ios/@2x/${icon}@2x.png`;
  }
}
