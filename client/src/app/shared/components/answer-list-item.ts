import { Component, Input, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';

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
  ) {}

  get isOwner() {
    return this.userId && this.question.userId && this.userId === this.question.userId;
  }

  get isDisable() {
    return !this.userId || this.isOwner;
  }

  answer() {
    if (!this.isDisable) {
      this.router.navigate([`/bank/question/${this.question.id}/answer`]);
    }
  }

  rank() {
    this.router.navigate([`/bank/rank/answer/${this.question.answerId}`]);
  }

  canRank() {
    if (this.question) {
      return false;
    }
    if (this.question.category === 'help') {
      return this.question.userId === this.userId;
    } else if (this.question.category === 'service') {
      return this.question.answerUserId === this.userId;
    }

    return false;
  }

  get isConfirm() {
    return this.question && this.question.orderId;
  }

  get actionLabel() {
    if (this.isConfirm) {
      return '评价';
    }
    return this.question.category === 'question' ? '回答' : '咨询';
  }

  content(a) {
    switch (a.type) {
      case 'price':
        return `出价: ${a.content}积分。 `;
      case 'confirm':
        return `交易确认: ${a.content}积分。 `;
      default:
        return a.content;
    }
  }

  username(s) {
    return s.userId === this.userId ? '我' : s.realname;
  }

  gotoSession(ev, s) {
    ev.stopPropagation();
    this.router.navigate(['/bank/question/' + this.question.id + '/answer', {answerId: s.answerId}]);
  }

  gotoQuestion() {
    this.router.navigate(['/bank/question/' + this.question.id]);
  }
}
