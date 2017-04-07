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
  categories: any[] = [];
  products: any[] = [];

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
      this.categories = value[0];
      this.products = value[1];
      this.categories.push({
        name: '全部',
        icon: 'http://www.crowdnear.com/m2/assets/images/ios/@2x/qb.png',
      });
    });
  }

  search(keyword) {
    this.router.navigate(['/market/search', {keyword: keyword}]);
  }
}
