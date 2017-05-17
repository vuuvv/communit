import { Component, ViewEncapsulation, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';

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
  templateUrl: './bank.html',
  styleUrls: ['./bank.less'],
  encapsulation: ViewEncapsulation.None,
})
export class BankComponent implements OnInit {
  tabs = ['问答', '求助', '服务'];
  ids = ['question', 'help', 'service'];
  type = 0;
  icons: any[] = null;
  articles: any[];
  services: any[] = [];
  shownIcons = [];
  isShowAll = false;

  constructor(
    private http: Http,
    private router: Router,
    private route: ActivatedRoute,
    private overlayService: OverlayService,
  ) {}

  ngOnInit() {
    this.route.params.concatMap((params: Params) => {
      this.overlayService.loading();
      return Observable.forkJoin(
        this.http.get('/menu/bank'),
        this.http.get('/service/search'),
        this.http.get('/articles/home'),
      );
    }).subscribe((values: any) => {
      this.overlayService.hideToast();
      this.icons = values[0];
      this.services = values[1].map((s) => {
        s.data = JSON.parse(s.content);
        return s;
      });
      this.isShowAll = false;
      this.shownIcons = this.getShowIcons();
      this.articles = values[2];
    });
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

    if (icon.id) {
      this.router.navigate([`/bank/child/${icon.id}`]);
      return;
    }
  }
}
