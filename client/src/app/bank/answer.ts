import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { Router } from '@angular/router';
import { Location } from '@angular/common';

import { Http, AuthorizeService, sumBy } from '../shared';
import { validate, FieldRule } from '../utils';
import { OverlayService, DialogService } from '../../components';

const rules: FieldRule[] = [
  { content: { strategy: ['required'], error: '请填写发送内容' } },
];

const categories = {
  question: '问答',
  help: '求助',
  service: '服务'
};

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
    const data = {
      content,
      answerId: this.answerId,
    };

    try {
      validate(data, rules);
    } catch (e) {
      this.dialogService.alert(e.message);
      return;
    }

    this.http.json(`/service/question/${this.questionId}/answer/add`, data).concatMap(() => {
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

  get canPay() {
    return this.isOwner && this.answer && !this.answer.orderId && this.question.points > this.question.payedPoints;
  }

  get canAnswer() {
    return this.userId && this.question && (
      this.userId === this.question.userId || !this.answer || this.answer.userId === this.userId
    );
  }

  get canBid() {
    return (this.question.category === 'service' || this.question.category === 'help') && (!this.answer || !this.answer.orderId);
  }

  get title() {
    if (!this.question) {
      return '';
    }

    if (!this.isAnswer && this.answer) {
      switch (this.question.category) {
        case 'question':
          return `来自${this.answer.realname}的回答`;
        case 'help':
          return `来自${this.answer.realname}的咨询`;
        case 'service':
          return `来自${this.answer.realname}的咨询`;

      }
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

  isMe(a) {
    return this.userId === a.userId;
  }

  isPrice(a) {
    return a.type === 'price';
  }

  isConfirm(a) {
    return a.type === 'confirm';
  }

  content(a) {
    switch (a.type) {
      case 'price':
        return `出价: ${a.points}积分。
如果同意这个价格，请点击本对话进行确认！
`;
      case 'confirm':
        return `交易确认: ${a.points}积分。
本次交易结束！
`;
      default:
        return a.content;
    }
  }

  confirm(a) {
    if (!this.isPrice(a) || this.isMe(a) || this.answer.orderId) {
      return;
    }

    if ([this.question.userId, this.answer.userId].indexOf(this.userId) !== -1) {
      this.dialogService.confirm(`确认同意对方的${a.points}个积分的出价`, '确认出价').ok((comp) => {
        comp.close();
        this.http.post(`/service/answer/session/${a.id}/confirm`).concatMap(() => this.getAnswer()).subscribe(() => {
        });
      });
    }
  }
}
