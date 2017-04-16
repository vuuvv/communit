import { Component, Input, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/forkJoin';

import { Http, FormService, WechatService } from '../shared';
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

export class BaseProductEditComponent {
  product: any = {};
  categories: any[] = [];
  serverIds: string[] = [];
  actionsShown = false;
  uploader;
  index;

  constructor(
  ) {}

  clickItem(values) {
    this.actionsShown = true;
    this.uploader = values[0];
    this.index = values[1];
  }

  selectPhoto() {
    this.actionsShown = false;
    this.uploader.chooseImage();
  }

  previewPhotos() {
    this.actionsShown = false;
    this['wechatService'].previewImage(this.serverIds, this.index || 0);
  }

  deletePhoto() {
    this.actionsShown = false;
    if (this.uploader) {
      this.serverIds.splice(this.index, 1);
    }
  }
}

@Component({
  templateUrl: './product-form.html',
  styleUrls: ['./product-form.less'],
})
export class ProductAddComponent extends BaseProductEditComponent implements OnInit {
  title = '新增商品';

  constructor(
    private http: Http,
    private router: Router,
    private dialogService: DialogService,
    private overlayService: OverlayService,
    private formService: FormService,
    private wechatService: WechatService,
  ) { super(); }

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
    this.product.serverIds = this.serverIds;
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
export class ProductEditComponent extends BaseProductEditComponent implements OnInit {
  title = '编辑商品';

  constructor(
    private http: Http,
    private router: Router,
    private route: ActivatedRoute,
    private dialogService: DialogService,
    private overlayService: OverlayService,
    private formService: FormService,
    private wechatService: WechatService,
  ) { super() }

  ngOnInit() {
    this.overlayService.loading();
    this.route.params.concatMap((params) => {
      let id = params['id'];
      return Observable.forkJoin(
        this.http.get(`/product/item/${id}`),
        this.http.get('/product/category'),
      );
    }).subscribe((resp: any) => {
      this.overlayService.hideToast();
      this.product = resp[0];
      this.categories = resp[1];

      this.serverIds = this.product.images ? JSON.parse(this.product.images) : [];
    });
  }

  submit(form) {
    if (this.product.points + this.product.price > this.product.normalPrice) {
      this.dialogService.alert('积分+积分售价的总额不得超过商品的原价');
      return;
    }
    this.overlayService.loading();
    this.product.serverIds = this.serverIds;
    this.formService.submit(form, validMessages, `/product/edit/${this.product.id}`, this.product).subscribe(() => {
      this.overlayService.hideToast();
      this.router.navigate(['/store']);
    });
  }
}
