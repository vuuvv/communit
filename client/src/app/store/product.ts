import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { Http } from '../shared';
import { DialogService, OverlayService } from '../../components';

@Component({
  templateUrl: './product-form.html',
  styleUrls: ['./product-form.less'],
})
export class ProductAddComponent implements OnInit {
  title = '新增商品';
  product: any = {};
  categories: any[] = [];

  constructor(
    private http: Http,
    private router: Router,
    private dialogService: DialogService,
    private overlayService: OverlayService,
  ) {}

  ngOnInit() {
    this.http.get('/product/category').subscribe((value: any) => {
      this.categories = value;
      if (value && value.length) {
        this.product.categoryId = value[0].id;
      }
    });
  }

  submit() {
    if (this.product.points + this.product.price > this.product.normalPrice) {
      this.dialogService.alert('积分+积分售价的总额不得超过商品的原价');
      return;
    }
    this.overlayService.loading();
    this.http.json('/product/add', this.product).subscribe(() => {
      this.overlayService.hideToast();
      this.router.navigate(['/store']);
    });
  }
}
