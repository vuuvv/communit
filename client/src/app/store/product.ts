import { Component, Input, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/forkJoin';

import { Http, FormService } from '../shared';
import { DialogService, OverlayService } from '../../components';

const validMessages = {
  title: {
    required: '请填写商品名称',
  },
  points: {
    required: '请填写商品所需积分',
  },
  price: {
    required: '请填写积分售价',
  },
  normalPrice: {
    required: '请填写原价格',
  },
  stock: {
    required: '请填写库存',
  },
  description: {
    required: '请填写商品简介',
  },
};

@Component({
  templateUrl: './product-form.html',
  styleUrls: ['./product-form.less'],
})
export class ProductAddComponent implements OnInit {
  title = '新增商品';
  product: any = {};
  categories: any[] = [];
  serverIds: string[] = [];

  constructor(
    private http: Http,
    private router: Router,
    private dialogService: DialogService,
    private overlayService: OverlayService,
    private formService: FormService,
  ) {}

  ngOnInit() {
    this.http.get('/product/category').subscribe((value: any) => {
      this.categories = value;
      if (value && value.length) {
        this.product.categoryId = value[0].id;
      }
      this.product.stock = 1000;
    });
  }

  submit(form) {
    if (this.product.points + this.product.price > this.product.normalPrice) {
      this.dialogService.alert('积分+积分售价的总额不得超过商品的原价');
      return;
    }
    this.overlayService.loading();
    this.formService.submit(form, validMessages, '/product/add', this.product).subscribe(() => {
      this.overlayService.hideToast();
      this.router.navigate(['/store']);
    });
  }
}

@Component({
  templateUrl: './product-form.html',
  styleUrls: ['./product-form.less'],
})
export class ProductEditComponent implements OnInit {
  title = '编辑商品';
  product: any = {};
  categories: any[] = [];

  constructor(
    private http: Http,
    private router: Router,
    private route: ActivatedRoute,
    private dialogService: DialogService,
    private overlayService: OverlayService,
    private formService: FormService,
  ) {}

  ngOnInit() {
    Observable.forkJoin(
      this.route.params.concatMap((params: Params) => {
        let id = params['id'];
        return this.http.get(`/product/item/${id}`);
      }),
      this.http.get('/product/category')
    ).subscribe((values: any[]) => {
      this.product = values[0];
      this.categories = values[1];
    });
  }

  submit(form) {
    if (this.product.points + this.product.price > this.product.normalPrice) {
      this.dialogService.alert('积分+积分售价的总额不得超过商品的原价');
      return;
    }
    this.overlayService.loading();
    this.formService.submit(form, validMessages, `/product/edit/${this.product.id}`, this.product).subscribe(() => {
      this.overlayService.hideToast();
      this.router.navigate(['/store']);
    });
  }
}
