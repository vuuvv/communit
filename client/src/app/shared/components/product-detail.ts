import { Component, Input, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'product-detail',
  templateUrl: './product-detail.html',
  styleUrls: ['./product-detail.less'],
  encapsulation: ViewEncapsulation.None,
})
export class ProductDetailComponent {
  @Input() product: any;
}
