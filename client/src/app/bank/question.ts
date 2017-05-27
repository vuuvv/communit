import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { Router } from '@angular/router';
import { Location } from '@angular/common';

import { Http, AuthorizeService, sumBy } from '../shared';
import { OverlayService, DialogService } from '../../components';

@Component({
  templateUrl: './question.html',
  styleUrls: ['./question.less'],
  encapsulation: ViewEncapsulation.None,
})
export class QuestionComponent implements OnInit {
  question: any;
  questionId: string;

  constructor(
    private router: Router,
    private http: Http,
    private route: ActivatedRoute,
    private overlayService: OverlayService,
    private authorizeService: AuthorizeService,
    private dialogService: DialogService,
    private Location: Location,
  ) {}

  ngOnInit() {
    this.route.params.concatMap((params: Params) => {
      this.questionId = params['id'];
      return this.init();
    }).subscribe(() => null);
  }

  init() {
    this.overlayService.loading();
    return this.http.get(`/service/question/item/${this.questionId}`).map((question: any) => {
      this.overlayService.hideToast();
      this.question = question;
      if (this.question.currentUserId !== this.question.userId) {
        this.dialogService.alert('不可访问该页面').ok((comp) => {
          comp.close();
          this.Location.back();
        }).subscribe(() => null);
      }
    });
  }

  get canAnswer() {
    return this.question && this.question.currentUserId && this.question.userId !== this.question.currentUserId;
  }

  isQuestionOwner(a) {
    return this.question && this.question.currentUserId === this.question.userId;
  }

  isAnswerOwnser(a) {
    return this.question && this.question.currentUserId === a.userId;
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

  get label() {
    return {
      question: '回答',
      help: '帮助',
      service: '请求',
    }[this.question.category] || '';
  }

  answerStatus(a) {
    if (!a) {
      return '';
    }

    if (a.status === 'closed') {
      return '已关闭';
    }

    switch (this.question.category) {
      case 'question':
        switch (a.status) {
          case 'submit':
            return '待采纳';
          case 'done':
            return `已采纳, 获${a.points}积分`;
        }
        break;
      case 'help':
        switch (a.status) {
          case 'submit':
            return '待付款';
          case 'done':
            return `已完成, 获${a.points}积分`;
        }
        break;
      case 'service':
        switch (a.status) {
          case 'submit':
            return '待付款';
          case 'done':
            return `已完成, 付${a.points}积分`;
        }
        break;
    }
    return '';
  }

  actions(answer) {
    if (!this.question) {
      return [];
    }
    switch (this.question.category) {
      case 'question':
        switch (answer.status) {
          case 'submit':
            return ['pay'];
          default:
            return [];
        }
      case 'help':
        switch (answer.status) {
          case 'submit':
            return ['pay'];
          case 'done':
            return answer.isRanked ? [] : ['rank'];
          default:
            return [];
        }
      case 'service':
        switch (answer.status) {
          case 'submit':
            return ['edit', 'reject'];
          case 'done':
            return [];
        }
        break;
    }
    return [];
  }

  actionLabel(a) {
    if (!this.question) {
      return '';
    }

    return {
      question: {
        edit: '编辑',
        pay: '采纳',
        rank: '评价',
      },
      help: {
        edit: '编辑',
        pay: '付款',
        rank: '评价',
      },
      service: {
        edit: '编辑',
        pay: '付款',
        rank: '评价',
        reject: '拒绝',
      },
    }[this.question.category][a] || '';
  }

  pay(a) {
    if (!this.question) {
      return;
    }

    if (this.question.category === 'question') {
      this.router.navigate([`/bank/confirm/answer/${a.id}`]);
      return;
    }

    if (this.question.category === 'help') {
      this.dialogService.confirm(`确认向该用户支付${a.points}积分`).ok((comp) => {
        comp.close();
        this.overlayService.loading();
        this.http.post(`/service/answer/${a.id}/bid`).subscribe(() => {
          this.overlayService.hideToast();
          this.router.navigate(['/user/service/help/0', {t: new Date().getTime()}]);
        });
      });
    }
  }

  edit(a) {
    if (!this.question) {
      return;
    }
    this.router.navigate([`/user/answer/${a.id}/edit`]);
  }

  reject(a) {
    if (!this.question) {
      return;
    }
    this.dialogService.confirm(`确认拒绝用户${this.question.realname}的${this.label}`).ok((comp) => {
      comp.close();
      this.init().subscribe(() => null);
    });
  }
}
