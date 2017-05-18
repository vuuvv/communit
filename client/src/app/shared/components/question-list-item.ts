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
}
