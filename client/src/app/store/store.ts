import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';

import { Http, FormService } from '../shared';
import { OverlayService } from '../../components';

const validMessages = {
  name: {
    required: '请填写店铺名称',
  },
  legalRepresentative: {
    required: '请填写法人代表',
  },
  legalRepresentativeTel: {
    required: '请填写法人代表手机',
  },
  businessScope: {
    required: '请填写经营范围',
  },
  contact: {
    required: '请填写联系人',
  },
  tel: {
    required: '请填写联系方式',
  },
  description: {
    required: '请填写店铺简介',
  },
  address: {
    required: '请填写店铺地址',
  },
};

@Component({
  templateUrl: './store.html',
  styleUrls: ['./store.less'],
  encapsulation: ViewEncapsulation.None,
})
export class StoreComponent implements OnInit {
  store: any;
  products: any[];
  orders: any[];
  accounts: any[];
  tabs = ['订单', '商品', '积分'];
  currentIndex;

  constructor(
    private http: Http,
    private overlayService: OverlayService,
    private route: ActivatedRoute,
  ) {}

  ngOnInit() {
    this.overlayService.loading();
    this.route.params.concatMap((params: Params) => {
      this.currentIndex = params['id'];
      return this.http.get('/store');
    }).subscribe((ret: any) => {
      this.store = ret.store;
      this.products = ret.products;
      this.orders = ret.orders;
      this.accounts = ret.accounts;
      this.overlayService.hideToast();
      setTimeout(() => {
        this.currentIndex = 0;
      }, 0);
    });
  }

  get isNormal() {
    return this.store && this.store.status === 'normal';
  }

  get isSubmit() {
    return this.store && this.store.status === 'submit';
  }

  get isEmpty() {
    return !this.products || this.products.length;
  }
}

@Component({
  templateUrl: './store-form.html',
  styleUrls: ['./store-form.less'],
})
export class StoreAddComponent {
  title = '申请店铺';
  store: any = {};
  constructor(
    private http: Http,
    private router: Router,
    private formService: FormService,
  ) {}

  submit(form) {
    this.formService.submit(form, validMessages, '/store/add', this.store).subscribe(() => {
      this.router.navigate(['/store']);
    });
  }
}

@Component({
  selector: 'store-edit',
  templateUrl: './store-form.html',
  styleUrls: ['./store-form.less'],
})
export class StoreEditComponent implements OnInit {
  title = '编辑店铺';
  store: any = {};
  products: any[] = [];

  constructor(
    private http: Http,
    private router: Router,
    private formService: FormService,
  ) {}

  ngOnInit() {
    this.http.get('/store').subscribe((ret: any) => {
      this.store = ret.store;
    });
  }

  submit(form) {
    this.formService.submit(form, validMessages, '/store/edit', this.store).subscribe(() => {
      this.router.navigate(['/store']);
    });
  }
}
