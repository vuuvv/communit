import { Component, Input, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'v-cell',
  templateUrl: './cell.html',
  styleUrls: ['./cell.less'],
  encapsulation: ViewEncapsulation.None,
  host: {
    '[class.weui-cell]': 'true',
    '[class.ngv-tap-active]': 'true'
  }
})
export class CellComponent {
  @Input() title: string;
  @Input() value: string;
  @Input() isLink: boolean;
  @Input() inlineDesc: string;
  @Input() primary: string = 'title';
}