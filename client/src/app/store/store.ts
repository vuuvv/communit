import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { Http } from '../shared';
import { OverlayService } from '../../components';

@Component({
  templateUrl: './store.html',
  styleUrls: ['./store.less'],
})
export class StoreComponent implements OnInit {
  store: any;
  products: any[];

  constructor(
    private http: Http,
    private overlayService: OverlayService,
  ) {}

  ngOnInit() {
    this.overlayService.loading();
    this.http.get('/store').subscribe((ret: any) => {
      this.store = ret.store;
      this.overlayService.hideToast();
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
  title: '申请店铺';
  store: any = {};
  constructor(
    private http: Http,
    private router: Router,
  ) {}

  submit() {
    this.http.json('/store/add', this.store).subscribe(() => {
      this.router.navigate(['/store']);
    });
  }
}

@Component({
  templateUrl: './store-form.html',
  styleUrls: ['./store-form.less'],
})
export class StoreEditComponent implements OnInit {
  title: '编辑店铺';
  store: any = {};
  constructor(
    private http: Http,
    private router: Router,
  ) {}

  ngOnInit() {
    this.http.get('/store').subscribe((ret: any) => {
      this.store = ret.store;
    });
  }

  submit() {
    this.http.json('/store/edit', this.store).subscribe(() => {
      this.router.navigate(['/store']);
    });
  }
}
