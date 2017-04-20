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
  icons: any[] = null;
  articles: any[];
  services: any[] = [];
  shownIcons = [];

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
      this.http.get('/articles/home'),
    ).subscribe((values: any) => {
      this.overlayService.hideToast();
      this.icons = values[0];
      this.services = values[1].map((s) => {
        s.data = JSON.parse(s.content);
        return s;
      });
      this.shownIcons = this.getCollapsedIcons();
      this.articles = values[2];
    });
  }

  getCollapsedIcons() {
    if (!this.icons || !this.icons.length) {
      return [];
    }
    if (this.icons.length <= 10) {
      return this.icons;
    }
    let ret = this.icons.slice(0, 9);
    ret.push({
      name: '全部',
      image: 'http://www.crowdnear.com/m2/assets/images/ios/@2x/qb.png',
    });
    return ret;
  }

  goto(icon) {
    if (icon.name === '全部') {
      this.shownIcons = this.icons;
      return;
    }

    if (icon.id) {
      this.router.navigate([`/bank/child/${icon.id}`]);
      return;
    }
  }
}
