import { Component, Input, ViewEncapsulation } from '@angular/core';

const ProductStatus = {
  online: '在售中',
  offline: '已下架',
};

@Component({
  selector: 'product-detail',
  templateUrl: './product-detail.html',
  styleUrls: ['./product-detail.less'],
  encapsulation: ViewEncapsulation.None,
})
export class ProductDetailComponent {
  @Input() product: any;

  getStatus() {
    return ProductStatus[this.product.status];
  }

  get images() {
    if (!this.product || !this.product.images) {
      return null;
    }
    return JSON.parse(this.product.images);
  }
}
