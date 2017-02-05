import { Component, Input, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'v-badge',
  templateUrl: './badge.html',
  styleUrls: ['./badge.less'],
  encapsulation: ViewEncapsulation.None,
  host: {
    '[class.ngv-badge-single]': "text && text.length === 1",
  }
})
export class BadgeComponent {
  @Input() text: string = "";
}
