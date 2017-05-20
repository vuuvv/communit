import { Component, Input, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'question-list-item',
  templateUrl: './question-list-item.html',
  styleUrls: ['./question-list-item.less'],
  encapsulation: ViewEncapsulation.None,
})
export class QuestionListItemComponent {
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

  gotoSession(ev, s) {
    ev.stopPropagation();
    this.router.navigate(['/bank/question/' + this.question.id + '/answer', {answerId: s.answerId}]);
  }

  gotoQuestion() {
    this.router.navigate(['/bank/question/' + this.question.id]);
  }
}
