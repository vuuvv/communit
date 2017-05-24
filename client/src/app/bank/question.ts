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
    switch (a.answerType) {
      case 'price':
        return `出价：${a.answerContent}积分`;
      case 'confirm':
        return `确认交易：${a.answerContent}积分`;
      default:
        return a.answerContent;
    }
  }

  isQuestionOwner(a) {
    return this.question && this.question.currentUserId === this.question.userId;
  }

  isAnswerOwnser(a) {
    return this.question && this.question.currentUserId === a.userId;
  }

  needHide(a) {
    return this.question.category !== 'question' && !this.isQuestionOwner(a) && !this.isAnswerOwnser(a);
  }

  gotoAnswer(a) {
    if (!this.needHide(a)) {
      this.router.navigate(['/bank/question/' + this.question.id + '/answer', {answerId: a.id}])
    }
  }

  get title() {
    if (!this.question) {
      return '';
    }

    switch (this.question.category) {
      case 'question':
        return `来自${this.question.realname}的提问`;
      case 'help':
        return `来自${this.question.realname}的求助`;
      case 'service':
        return `${this.question.realname}提供的服务`;
    }

    return '';
  }
}
