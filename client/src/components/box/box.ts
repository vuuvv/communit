import { Component, Input, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'v-box',
  templateUrl: './box.html',
  styleUrls: ['./box.less'],
  encapsulation: ViewEncapsulation.None,
  host: {
    '[class.weui-panel]': 'true',
  }
})
export class BoxComponent {
  @Input() title;
}
