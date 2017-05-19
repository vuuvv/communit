import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Location } from '@angular/common';

import { Http, AuthorizeService } from '../shared';
import { validate, FieldRule } from '../utils';
import { DialogService, OverlayService } from '../../components';

const rules: FieldRule[] = [
  { content: { strategy: ['required'], error: '请填写积分' } },
  { content: { strategy: ['isInteger'], error: '积分必须为整数' } },
];

@Component({
  templateUrl: './bid.html',
  encapsulation: ViewEncapsulation.None,
})
export class BidComponent implements OnInit {
  answer;
  question;
  balance;
  content = 1;
  currentUserId;

  constructor(
    private http: Http,
    private location: Location,
    private dialogService: DialogService,
    private overlayService: OverlayService,
    private authorizeService: AuthorizeService,
    private router: Router,
    private route: ActivatedRoute,
  ) {}

  ngOnInit() {
    this.overlayService.loading();
    this.route.params.concatMap((params: Params) => {
      return this.http.get(`/service/question/${params['id']}/answer`);
    }).subscribe((v: any) => {
      this.overlayService.hideToast();
      this.answer = v.answer;
      this.question = v.question;
      this.balance = v.balance;
      this.currentUserId = v.userId;
      if ((this.question.userId !== this.currentUserId && (this.answer && this.answer.userId !== this.currentUserId))
       || (!this.answer && this.question.userId === this.currentUserId)) {
        this.dialogService.alert('不可进行此操作').ok((comp) => {
          comp.close();
          this.location.back();
        }).subscribe(() => null);
      }
    });
  }

  back() {
    this.location.back();
  }

  get isAnswerer() {
    return !this.answer || this.answer.userId === this.currentUserId;
  }

  get isQuestioner() {
    return this.question.userId === this.currentUserId;
  }

  get isPayer() {
    if (this.question.category === 'help') {
      return this.isQuestioner;
    } else if (this.question.category === 'service') {
      return this.isAnswerer;
    }
    return false;
  }

  get title() {
    switch (this.question.category) {
      case 'help':
        if (this.isAnswerer) {
          return `对求助者${this.question.realname}的出价`;
        } else if (this.isQuestioner) {
          return `对询问者${this.answer.realname}的出价`;
        }
        break;
      case 'service':
        if (this.isAnswerer) {
          return `对${this.question.realname}服务的出价`;
        } else if (this.isQuestioner) {
          return `对询问者${this.answer.realname}的出价`;
        }
        break;
    }
    return '出价';
  }

  get meta() {
    switch (this.question.category) {
      case 'help':
        if (this.isAnswerer) {
          return `请输入你需要求助者[${this.question.realname}]支付多少积分`;
        } else if (this.isQuestioner) {
          return `请输入你可以给[${this.answer.realname}]多少积分`;
        }
        break;
      case 'service':
        if (this.isAnswerer) {
          return `请输入你可以向[${this.question.realname}]提供的服务支付多少积分`;
        } else if (this.isQuestioner) {
          return `请输入你需要[${this.answer.realname}]支付多少积分`;
        }
        break;
    }
    return '出价';
  }

  submit() {
    const answerId = this.answer ? this.answer.id : null;
    const data = { content: this.content, answerId, type: 'price' };
    try {
      validate(data, rules);
    } catch (e) {
      this.dialogService.alert(e.message);
      return;
    }

    this.http.json(`/service/question/${this.question.id}/answer/add`, data).subscribe(() => {
      this.location.back();
    });
  }
}
