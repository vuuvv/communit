import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { Router } from '@angular/router';
import { Location } from '@angular/common';

import { Http, AuthorizeService, sumBy } from '../shared';
import { OverlayService, DialogService } from '../../components';

@Component({
  templateUrl: './answer.html',
  styleUrls: ['./answer.less'],
  encapsulation: ViewEncapsulation.None,
})
export class AnswerComponent implements OnInit {
  // title = '你的回答';
  answers: any[] = [];
  questionId: string;
  answerId: string;
  userId: string;
  answer: any;
  question: any;

  constructor(
    private router: Router,
    private http: Http,
    private route: ActivatedRoute,
    private overlayService: OverlayService,
    private authorizeService: AuthorizeService,
    private dialogService: DialogService,
    private location: Location,
  ) {}

  ngOnInit() {
    this.route.params.concatMap((params: Params) => {
      this.questionId = params['id'];
      this.answerId = params['answerId'];
      this.overlayService.loading();
      return this.getAnswer();
    }).subscribe(() => {});
  }

  getAnswer() {
    this.overlayService.loading();
    return this.http.get(`/service/question/${this.questionId}/answer`, {answerId: this.answerId}).map((resp: any) => {
      this.overlayService.hideToast();
      this.answers = resp.answers;
      this.userId = resp.userId;
      this.answer = resp.answer;
      this.question = resp.question;
      if (!this.answerId && this.answer) {
        this.answerId = this.answer;
      }
      if (this.isOwner && !this.answer) {
        this.location.back();
      }
    });
  }

  addAnswer(content, bottomInput) {
    this.http.json(`/service/question/${this.questionId}/answer/add`, {content, answerId: this.answerId}).concatMap(() => {
      return this.getAnswer();
    }).subscribe((resp: any) => {
      this.scrollToBottom();
      bottomInput.clear();
    });
  }

  scrollToBottom() {
    setTimeout(() => {
      const dom = document.querySelector('.ngv-page-content');
      dom.scrollTop = dom.scrollHeight - dom.clientHeight;
    });
  }

  get isOwner() {
    return this.userId && this.question && this.userId === this.question.userId;
  }

  get isAnswer() {
    return this.userId && this.answer && this.userId === this.answer.userId;
  }

  get canAnswer() {
    return this.userId && this.question && (
      this.userId === this.question.userId || !this.answer || this.answer.userId === this.userId
    );
  }

  get title() {
    if (!this.isAnswer && this.answer) {
      return `来自${this.answer.realname}的回答`;
    } else if (this.question) {
      return `来自${this.question.realname}的提问`;
    }

    return '';
  }

  isMe(userId: string) {
    return this.userId === userId;
  }
}
