import { Component, Input, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';

import { Http } from '../services';
import { DialogService, OverlayService } from '../../../components';

const status = {
  submit: '待确认',
  done: '已完成',
};

@Component({
  selector: 'answer-list-item',
  templateUrl: './answer-list-item.html',
  styleUrls: ['./question-list-item.less'],
  encapsulation: ViewEncapsulation.None,
})
export class AnswerListItemComponent {
  @Input() question: any;
  @Input() userId: string;

  get sessions() {
    if (this.question && this.question.sessions) {
      const ret = JSON.parse(this.question.sessions);
      return ret.sort((a, b) => {
        return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
      }).slice(0, 5);
    }
    return null;
  }

  constructor(
    private router: Router,
    private dialogService: DialogService,
    private overlayService: OverlayService,
    private http: Http,
  ) {}

  get isOwner() {
    return this.userId && this.question.userId && this.userId === this.question.userId;
  }

  get isDisable() {
    return !this.userId || this.isOwner;
  }


  content(a) {
    return a.content;
  }

  username(s) {
    return s.userId === this.userId ? '我' : s.realname;
  }

  get answerStatus() {
    if (!this.question) {
      return '';
    }

    if (this.question.answerStatus === 'closed') {
      return '已关闭';
    }

    switch (this.question.category) {
      case 'question':
        switch (this.question.answerStatus) {
          case 'submit':
            return '待采纳';
          case 'done':
            return `已采纳, 获${this.question.answerPoints}积分`;
        }
        break;
      case 'help':
        switch (this.question.answerStatus) {
          case 'submit':
            return '待付款';
          case 'done':
            return `已完成, 获${this.question.answerPoints}积分`;
        }
        break;
      case 'service':
        switch (this.question.answerStatus) {
          case 'submit':
            return '待付款';
          case 'done':
            return `已完成, 付${this.question.answerPoints}积分`;
        }
        break;
    }
    return '';
  }

  get actions() {
    if (!this.question) {
      return [];
    }
    switch (this.question.category) {
      case 'question':
        return [];
      case 'help':
        switch (this.question.answerStatus) {
          case 'submit':
            return ['edit', 'reject'];
          default:
            return [];
        }
      case 'service':
        switch (this.question.answerStatus) {
          case 'submit':
            return ['pay'];
          case 'done':
            if (this.question.answerRanked) {
              return [];
            } else {
              return ['rank'];
            }
        }
        break;
    }
    return [];
  }

  actionLabel(a) {
    return {
      edit: '编辑',
      pay: '付款',
      rank: '评价',
      reject: '拒绝',
    }[a] || '';
  }

  edit() {
    if (!this.question) {
      return;
    }
    this.router.navigate([`/user/answer/${this.question.answerId}/edit`]);
  }

  pay() {
    if (!this.question) {
      return;
    }

    if (this.question.category === 'service') {
      this.dialogService.confirm(`确认向该用户支付${this.question.answerPoints}积分`).ok((comp) => {
        comp.close();
        this.overlayService.loading();
        this.http.post(`/service/answer/${this.question.answerId}/bid`).subscribe(() => {
          this.overlayService.hideToast();
          this.router.navigate(['/user/service/service/1']);
        });
      });
    }
  }
}
