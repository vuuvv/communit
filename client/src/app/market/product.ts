import { Component, ViewEncapsulation, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';

import { Observable } from '../utils';


import { Http } from '../shared';
import { OverlayService, DialogService } from '../../components';

@Component({
  templateUrl: './product.html',
  styleUrls: ['./product.less'],
  encapsulation: ViewEncapsulation.None,
})
export class ProductComponent implements OnInit {
  product: any;
  account: number = 0;

  constructor(
    private route: ActivatedRoute,
    private http: Http,
    private router: Router,
    private overlayService: OverlayService,
    private dialogService: DialogService,
  ) {}

  ngOnInit() {
    this.overlayService.loading();
    this.route.params.concatMap((params) => {
      let id = params['id'];
      return Observable.forkJoin(
        this.http.get(`/product/item/${id}`),
        this.http.get('/account/balance'),
      );
    }).subscribe((resp: any) => {
      this.overlayService.hideToast();
      this.product = resp[0];
      this.account = resp[1];
    });
  }

  get canBuy() {
    return this.product && this.account && this.product.points <= this.account;
  }

  get buttonText() {
    if (this.product && this.product.points > this.account) {
      return '积分不足';
    }
    return '购买';
  }

  buy() {
    if (!this.canBuy) {
      this.dialogService.alert(this.buttonText, '警告');
      return;
    }
    this.overlayService.loading();
    this.dialogService.confirm(`您购买的这件商品需支付${this.product.points}积分，确定购买吗?`, '确认').ok((comp) => {
      comp.close();
      this.http.json('/order/buy/product', {productId: this.product.id, count: 1}).subscribe((order) => {
        this.dialogService.alert('您已下单成功， 请在15天内完成线下支付!');
        this.router.navigate([`/user/product/orders`]);
      });
    });
    /*
    this.http.post(`/qr/g/product/${this.product.id}`).subscribe((value) => {
      this.overlayService.hideToast();
      this.router.navigate([`/user/qr/${value}`]);
    });
    */
  }
}
