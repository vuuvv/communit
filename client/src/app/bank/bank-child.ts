import { Component, ViewEncapsulation, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/forkJoin';

import { Http } from '../shared';
import { OverlayService } from '../../components';

@Component({
  templateUrl: './bank-child.html',
  styleUrls: ['./bank-child.less'],
  encapsulation: ViewEncapsulation.None,
})
export class BankChildComponent implements OnInit {
  services: any[];
  menus: any[];
  children: any[];
  menu: any;
  shownChildren = [];
  isShowAll = false;

  constructor(
    private http: Http,
    private route: ActivatedRoute,
    private overlayService: OverlayService,
  ) {}

  ngOnInit() {
    this.overlayService.loading();
    this.route.params.concatMap((params: Params) => {
      let id = params['id'];
      return Observable.forkJoin(
        this.http.get(`/menu/bank/${id}/children`),
        this.http.get('/service/search'),
      );
    }).subscribe((values: any) => {
      this.overlayService.hideToast();
      let menus = values[0];
      this.menus = menus.all;
      this.menu = menus.current;
      this.children = JSON.parse(this.menu.children);
      this.shownChildren = this.getCollapsedMenus();
      this.services = values[1].map((s) => {
        s.data = JSON.parse(s.content);
        return s;
      });
    });
  }

  getCollapsedMenus() {
    if (!this.children || !this.children.length) {
      return [];
    }

    let size = 4;

    let length = this.children.length;
    let remain = size - length % size;

    if (remain < size) {
      for (let i = 0; i < remain; i++) {
        this.children.push({
        });
      }
    }

    if (this.children.length <= size * 2) {
      return this.children;
    }
    let ret = this.children.slice(0, size * 2);
    return ret;
  }

  showAll() {
    this.shownChildren = this.children;
    this.isShowAll = true;
  }

  goto(menu) {
  }
}
