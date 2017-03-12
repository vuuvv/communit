import { Component, ViewEncapsulation, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/forkJoin';

import { Http } from '../shared';
import { OverlayService } from '../../components';

@Component({
  templateUrl: './bank.html',
  styleUrls: ['./bank.less'],
  encapsulation: ViewEncapsulation.None,
})
export class BankComponent implements OnInit {
  menus: any[] = [];
  activeMenuId: string;
  roots: any[] = [];
  services: any[] = [];

  constructor(
    private http: Http,
    private router: Router,
    private overlayService: OverlayService,
  ) {}

  ngOnInit() {
    this.overlayService.loading();
    Observable.forkJoin(
      this.http.get('/menu/bank'),
      this.http.get('/service/search'),
    ).subscribe((values: any) => {
      this.overlayService.hideToast();
      this.menus = values[0];
      this.services = values[1].map((s) => {
        s.data = JSON.parse(s.content);
        return s;
      });

      let roots = this.roots = this.getRoots();
      for (let i = 0; i < roots.length; i++) {
        if (this.hasChilrend(roots[i])) {
          this.activeMenuId = roots[i].id;
          break;
        }
      }
    });
  }

  getRoots() {
    if (!this.menus) {
      return [];
    }

    return this.menus.filter((item) => {
      return !item.parentId;
    });
  }

  getMenus(pid = null) {
    if (!this.menus) {
      return [];
    }

    let ret = this.menus.filter((item) => {
      return item.parentId === pid;
    });

    return ret;
  }

  hasChilrend(menu) {
    return this.getMenus(menu.id).length > 0;
  }

  clickMainMenu(m) {
    if (m.url) {
      this.router.navigate([m.url]);
      return;
    }
    this.activeMenuId = m.id;
  }

  click() {
    console.log('click');
  }
}
