import { Component, ViewEncapsulation, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/forkJoin';

import { Http } from '../shared';
import { OverlayService } from '../../components';

@Component({
  templateUrl: './market.html',
  styleUrls: ['./market.less'],
  encapsulation: ViewEncapsulation.None,
})
export class MarketComponent implements OnInit {
  icons: any[] = [];
  products: any[] = [];
  showMask = false;
  shownIcons = [];

  constructor(
    private http: Http,
    private overlayService: OverlayService,
    private router: Router,
  ) {}

  ngOnInit() {
    this.overlayService.loading();
    Observable.forkJoin(
      this.http.get('/product/category'),
      this.http.get('/product')
    ).subscribe((value: any[]) => {
      this.overlayService.hideToast();
      this.icons = value[0];
      this.shownIcons = this.getCollapsedIcons();
      this.products = value[1];
    });
  }

  search(keyword) {
    this.router.navigate(['/market/search', {keyword: keyword}]);
  }

  getCollapsedIcons() {
    if (!this.icons || !this.icons.length) {
      return [];
    }

    let size = 4;

    let length = this.icons.length;
    let remain = size - length % size;

    if (remain < size) {
      for (let i = 0; i < remain; i++) {
        this.icons.push({
        });
      }
    }

    if (this.icons.length <= size * 2) {
      return this.icons;
    }
    let ret = this.icons.slice(0, size * 2 - 1);
    ret.push({
      name: '全部',
      icon: 'http://www.crowdnear.com/m2/assets/images/ios/@2x/qb.png',
    });
    return ret;
  }

  goto(icon) {
    if (icon.name === '全部') {
      this.shownIcons = this.icons;
      return;
    }

    this.router.navigate(['/market/search', {categoryId: icon.id}]);
    return;
  }
}
