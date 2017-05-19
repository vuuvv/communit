import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { Router } from '@angular/router';

import { Http, AuthorizeService, sumBy } from '../shared';
import { OverlayService, DialogService } from '../../components';

@Component({
  templateUrl: './question.html',
  styleUrls: ['./question.less'],
  encapsulation: ViewEncapsulation.None,
})
export class QuestionComponent implements OnInit {
  question: any;

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
      return this.http.get(`/service/question/item/${params['id']}`);
    }).subscribe((question) => {
      this.question = question;
    });
  }

  get canAnswer() {
    return this.question && this.question.currentUserId && this.question.userId !== this.question.currentUserId;
  }

  answerContent(a) {
    switch (a.type) {
      case 'price':
        return `出价：${a.points}积分`;
      case 'confirm':
        return `确认交易：${a.points}积分`;
      default:
        return a.content;
    }
  }
}
