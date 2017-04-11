import { Component, ViewEncapsulation, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/forkJoin';

import { Http } from '../shared';
import { OverlayService, DialogService } from '../../components';

@Component({
  templateUrl: './product-detail.html',
  encapsulation: ViewEncapsulation.None,
})
export class ProductDetailComponent implements OnInit {
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
      return this.http.get(`/product/item/${id}`, {isMine: true});
    }).subscribe((resp: any) => {
      this.overlayService.hideToast();
      this.product = resp;
    });
  }

  change() {
    let message = '';
    let u = '';
    if (this.product.status === 'online') {
      message = '确定下架该产品';
      u = 'offline';
    } else if (this.product.status === 'offline') {
      message = '确定上架该产品';
      u = 'online';
    }
    this.dialogService.confirm(message, '确认').ok((comp) => {
      comp.close();
      this.overlayService.loading();
      this.http.post(`/product/${u}/${this.product.id}`).subscribe(() => {
        this.overlayService.toast('操作成功');
        this.product.status = u;
      });
    });
  }
}
