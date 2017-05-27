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
  @Input() showUser = true;

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

  answer() {
    this.router.navigate([`/bank/question/${this.question.id}/answer/add`]);
  }

  gotoQuestion() {
    if (!this.isOwner) {
      this.router.navigate(['/bank/question/' + this.question.id + '/answer/add']);
    } else {
      this.router.navigate([`/bank/question/${this.question.id}`]);
    }
  }

  get actionLabel() {
    return {
      question: '回答',
      help: '帮助',
      service: '请求',
    }[this.question.category] || '';
  }
}
