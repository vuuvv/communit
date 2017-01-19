import { Component, Input, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'v-group',
  templateUrl: './group.html',
  styleUrls: ['./group.less'],
  encapsulation: ViewEncapsulation.None,
})
export class GroupComponent {
  @Input() title: string;
  @Input() titleColor: string;
  @Input() labelWidth: string;
  @Input() labelAlign: string;
  @Input() labelMarginRight: string;
  @Input() gutter: string;
}
