import { Component, Input, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'v-cell',
  templateUrl: './cell.html',
  styleUrls: ['./cell.less'],
  encapsulation: ViewEncapsulation.None,
  host: {
    '[class.weui-cell]': 'true',
    '[class.ngv-tap-active]': 'isLink'
  }
})
export class CellComponent {
  @Input() label: string;
  @Input() value: string;
  @Input() isLink: boolean;
  @Input() hasMore: boolean;
  @Input() inlineDesc: string;
  @Input() primary: string = 'title';
}
