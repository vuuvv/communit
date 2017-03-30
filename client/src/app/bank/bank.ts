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
  menus: any[] = null;
  activeMenuId: string;
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
      this.menus = this.fillMenu(values[0]);
      this.services = values[1].map((s) => {
        s.data = JSON.parse(s.content);
        return s;
      });
    });
  }

  getIcon(url) {
    if (/^((https?:\/\/)|(\/\/))/.test(url)) {
      return url;
    }
    return `http://www.crowdnear.com/pc/${url}`;
  }

  click() {
    console.log('click');
  }

  private fillMenu(menus) {
    if (!menus || !menus.length) {
      return null;
    }

    let len = menus.length;
    let need = 8 - (menus.length % 8);

    if (need !== 8) {
      for (let i = 0; i < need; i++) {
        menus.push({});
      }
    }

    return menus;
  }
}
