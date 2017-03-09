import { Component, ViewEncapsulation, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';

import { Http } from '../shared';
import { OverlayService } from '../../components';

@Component({
  templateUrl: './search.html',
  styleUrls: ['./search.less'],
  encapsulation: ViewEncapsulation.None,
})
export class SearchComponent implements OnInit {
  products: any[] = [];
  loading: boolean = true;

  constructor(
    private route: ActivatedRoute,
    private http: Http,
  ) {}

  ngOnInit() {
    this.route.params.concatMap((params: Params) => {
      return this.http.get('/product', Object.assign({}, params));
    }).subscribe((resp: any) => {
      this.products = resp;
      this.loading = false;
    });
  }

  get tip() {
    return this.loading ? '正在加载' : '没有此类产品';
  }
}
