import { Component, Type, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { DatePipe } from '@angular/common';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/forkJoin';

import { OverlayService, DialogService, SliderComponent } from '../../components';
import { Http } from '../shared';

@Component({
  templateUrl: './community.html',
  styleUrls: ['./community.less'],
  encapsulation: ViewEncapsulation.None,
  providers: [DatePipe],
})
export class CommunityComponent implements OnInit {

  @ViewChild(SliderComponent) slider: SliderComponent;
  carousel: any[];
  icons: any[];
  articles: any[];
  logo: any;
  showMask = false;
  shownIcons = [];

  constructor(
    private overlayService: OverlayService,
    private dialogService: DialogService,
    private http: Http,
    private router: Router,
    private datePipe: DatePipe,
  ) { }

  ngOnInit() {
    this.overlayService.loading();
    Observable.forkJoin(
     this.http.get('/user/carousel'),
     this.http.get('/menu/community'),
     this.http.get('/articles/home'),
     this.http.get('/user/logo')
    ).subscribe((values: any[]) => {
      this.overlayService.hideToast();
      this.carousel = values[0];
      this.icons = values[1];
      this.shownIcons = this.getCollapsedIcons();
      this.articles = values[2];
      this.logo = values[3];
    });
  }

  getCollapsedIcons() {
    if (!this.icons || !this.icons.length) {
      return [];
    }
    if (this.icons.length <= 8) {
      return this.icons;
    }
    let ret = this.icons.slice(0, 7);
    ret.push({
      name: '全部',
      image: 'http://www.crowdnear.com/m2/assets/images/ios/@2x/qb.png',
    });
    return ret;
  }

  goto(icon) {
    if (icon.name === '全部') {
      this.shownIcons = this.icons;
      // this.showMask = true;
      return;
    }

    if (icon.url) {
      this.router.navigate([icon.url]);
      return;
    }

    let id = icon.id;
    this.http.get(`/menu/community/${id}`).subscribe((value: any) => {
      let children = value.children;
      if (children && children.length) {
        this.router.navigate([`/community/summary/${id}`]);
      } else {
        this.router.navigate([`/articles/${id}`]);
      }
    });
  }
}
