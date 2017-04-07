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
      this.menus = values[0];
      this.services = values[1].map((s) => {
        s.data = JSON.parse(s.content);
        return s;
      });
      this.menus.push({
        name: '全部',
        icon: 'http://www.crowdnear.com/m2/assets/images/ios/@2x/qb.png',
      });
    });
  }

  click() {
    console.log('click');
  }
}
