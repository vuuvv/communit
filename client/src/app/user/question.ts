import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { Router } from '@angular/router';

import { Observable } from '../utils';
import { Http, AuthorizeService, sumBy } from '../shared';
import { OverlayService, DialogService } from '../../components';

@Component({
  templateUrl: './question.html',
  styleUrls: ['./question.less'],
  encapsulation: ViewEncapsulation.None,
})
export class QuestionComponent implements OnInit {
  services: any[];
  titles = {
    question: '问答',
    help: '求助',
    service: '服务',

  };

  tabs = {
    question: ['我的提问', '我的回答'],
    help: ['我的求助', '我的咨询'],
    service: ['我的服务', '我的咨询'],
  };
  currentTabs;
  category;
  type;
  userId;

  constructor(
    private router: Router,
    private http: Http,
    private route: ActivatedRoute,
    private overlayService: OverlayService,
    private authorizeService: AuthorizeService,
    private dialogService: DialogService,
  ) {}

  ngOnInit() {
    this.route.params.concatMap((params: Params) => {
      this.category = params['category'];
      this.type = params['type'];
      this.currentTabs = this.tabs[this.category];
      if (this.type === '0') {
        return Observable.forkJoin(
          this.http.get(`/service/search`, {categoryId: this.category, isMine: true, needSessions: true}),
          this.http.get('/user/id'),
        );
      } else {
        return Observable.forkJoin(
          this.http.get(`/service/search/my/answer`, {categoryId: this.category}),
          this.http.get('/user/id'),
        );
      }
    }).subscribe((values: any) => {
      this.services = values[0];
      this.userId = values[1];
    });
  }

  get title () {
    return this.titles[this.category] || '';
  }
}
