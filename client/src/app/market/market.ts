import { Component, ViewEncapsulation, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { Observable } from '../utils';


import { Http } from '../shared';
import { OverlayService } from '../../components';
import { paddingArray } from '../utils';

const allButton = {
  name: '更多',
  image: 'http://www.crowdnear.com/m2/assets/images/ios/@2x/qb.png',
};

const collapseButton = {
  name: '收起',
  image: 'http://www.crowdnear.com/m2/assets/images/collapse.png',
};

@Component({
  templateUrl: './market.html',
  styleUrls: ['./market.less'],
  encapsulation: ViewEncapsulation.None,
})
export class MarketComponent implements OnInit {
  icons: any[] = [];
  products: any[] = [];
  articles: any[] = [];
  showMask = false;
  shownIcons = [];
  isShowAll = false;

  constructor(
    private http: Http,
    private overlayService: OverlayService,
    private router: Router,
  ) {}

  ngOnInit() {
    this.overlayService.loading();
    Observable.forkJoin(
      this.http.get('/product/category'),
      this.http.get('/product'),
      this.http.get('/articles/home'),
    ).subscribe((value: any[]) => {
      this.overlayService.hideToast();
      this.icons = value[0];
      this.products = value[1];
      this.articles = value[2];
      this.isShowAll = false;
      this.shownIcons = this.getShowIcons();
    });
  }

  search(keyword) {
    this.router.navigate(['/market/search', {keyword: keyword}]);
  }

  getShowIcons() {
    return this.isShowAll ?
      paddingArray(this.icons, 5, 0, {}, collapseButton) :
      paddingArray(this.icons, 5, 2, {}, allButton);
  }

  goto(icon) {
    if ([collapseButton.name, allButton.name].indexOf(icon.name) !== -1) {
      this.isShowAll = !this.isShowAll;
      this.shownIcons = this.getShowIcons();
      return;
    }

    this.router.navigate([`/market/child/${icon.id}`]);
    return;
  }
}
