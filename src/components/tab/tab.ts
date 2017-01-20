import { Component, Input, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'v-tab',
  templateUrl: './tab.html',
  styleUrls: ['./tab.less'],
  encapsulation: ViewEncapsulation.None,
})
export class TabComponent {
  @Input() lineWidth: number = 3;
  @Input() activeColor: string = '#04be02';
  @Input() defaultColor: string = '#666';
  @Input() disabledColor: string = '#ddd';
  @Input() animate: boolean = false;
}
