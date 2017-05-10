import { Component, ViewEncapsulation, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';

import { Observable } from '../utils';


import { Http } from '../shared';
import { OverlayService } from '../../components';
import { paddingArray } from '../utils';

@Component({
  templateUrl: './market-child.html',
  styleUrls: ['./market-child.less'],
  encapsulation: ViewEncapsulation.None,
})
export class MarketChildComponent implements OnInit {
  products: any[];
  // 所有的菜单分类
  menus: any[];
  // 当前子类
  children: any[];
  // 当前菜单
  menu: any;
  shownChildren = [];
  isShowAll = false;

  selectedMenu: any;
  selectedChildren: any = [];

  currentId: string;

  filterStatus: number = 0;

  sort: string;
  category: string;

  constructor(
    private http: Http,
    private route: ActivatedRoute,
    private overlayService: OverlayService,
  ) {}

  ngOnInit() {
    this.route.params.concatMap((params: Params) => {
      let id = params['id'];
      this.currentId = id;
      this.overlayService.loading();
      return Observable.forkJoin(
        this.http.get(`/product/category/${id}/children`),
        this.http.get('/product', {categoryId: id}),
      );
    }).subscribe((values: any) => {
      this.overlayService.hideToast();
      let menus = values[0];
      this.menus = menus.all.map((v) => {
        v.children = JSON.parse(v.children);
        return v;
      });
      this.menu = menus.current;
      this.children = this.menu.children = JSON.parse(this.menu.children);
      this.isShowAll = false;
      this.shownChildren = this.getShowIcons();
      this.selectMain(this.menu);
      this.products = values[1];

      this.filterStatus = 0;
    });
  }

  load() {
    this.filterStatus = 0;
    this.overlayService.loading();
    this.http.get('/product', {sort: this.sort, categoryId: this.category}).subscribe((v: any) => {
      this.overlayService.hideToast();
      this.products = v.map((s) => {
        s.data = JSON.parse(s.content);
        return s;
      });
    });
  }

  get needCollapse() {
    return this.children && this.children.length && this.children.length > 8;
  }

  toggle() {
    this.isShowAll = !this.isShowAll;
    this.shownChildren = this.getShowIcons();
  }

  getShowIcons() {
    return this.isShowAll ?
      paddingArray(this.children, 4, 0) :
      paddingArray(this.children, 4, 2);
  }

  selectMain(menu) {
    this.selectedMenu = menu;
    this.selectedChildren = menu.children;
  }

  clickMask() {
    this.filterStatus = 0;
  }

  showCategories() {
    this.filterStatus = 1;
  }

  showSort() {
    this.filterStatus = 2;
  }

  showCategory() {
    this.filterStatus = 3;
    console.log(this.category);
  }

  selectSort(sort) {
    this.sort = sort;
    this.load();
  }

  selectCategory(category) {
    this.category = category;
    this.load();
  }
}
