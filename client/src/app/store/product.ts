import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Http } from '../shared';

@Component({
  templateUrl: './product-form.html',
  styleUrls: ['./product-form.less'],
})
export class ProductAddComponent {
  title = '新增商品';
  product: any = {};

  constructor(
    private http: Http,
    private router: Router,
  ) {}

  submit() {
    this.http.json('/store/product/add', this.product).subscribe(() => {
      this.router.navigate(['/store']);
    });
  }
}
