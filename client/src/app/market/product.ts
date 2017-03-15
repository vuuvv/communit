import { Component, ViewEncapsulation, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/forkJoin';

import { Http } from '../shared';
import { OverlayService } from '../../components';

@Component({
  templateUrl: './product.html',
  styleUrls: ['./product.less'],
  encapsulation: ViewEncapsulation.None,
})
export class ProductComponent implements OnInit {
  product: any;
  account: number;

  constructor(
    private route: ActivatedRoute,
    private http: Http,
    private router: Router,
    private overlayService: OverlayService,
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
    if (this.product && this.account && this.product.points > this.account) {
      return '积分不足';
    }
    return '购买';
  }

  buy() {
    if (!this.canBuy) {
      return;
    }
    this.overlayService.loading();
    this.http.post(`/qr/g/product/${this.product.id}`).subscribe((value) => {
      this.overlayService.hideToast();
      this.router.navigate([`/user/qr/${value}`]);
    });
  }
}
