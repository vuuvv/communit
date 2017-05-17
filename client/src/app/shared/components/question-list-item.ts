import { Component, Input, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'question-list-item',
  templateUrl: './question-list-item.html',
  styleUrls: ['./question-list-item.less'],
  encapsulation: ViewEncapsulation.None,
})
export class QuestionListItemComponent {
  @Input() question: any;
}
