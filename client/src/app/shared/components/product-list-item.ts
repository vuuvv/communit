import { Component, Input, ViewEncapsulation } from '@angular/core';

const productStatus = {
  submit: '审核中',
  online: '在售',
  offline: '已下架',
  reject: '审核不通过',
};

@Component({
  selector: 'product-list-item',
  templateUrl: './product-list-item.html',
  styleUrls: ['./product-list-item.less'],
  encapsulation: ViewEncapsulation.None,
})
export class ProductListItemComponent {
  @Input() product: any;
  @Input() full: boolean = true;

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

  getProductStatus(status) {
    return productStatus[status] || status;
  }
}
