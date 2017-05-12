import { Component, Input, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'v-tab',
  templateUrl: './tab.html',
  styleUrls: ['./tab.less'],
  encapsulation: ViewEncapsulation.None,
})
export class TabComponent {
  @Input() animate: boolean = false;
}

@Component({
  selector: 'v-tab-item',
  templateUrl: './tab-item.html',
})
export class TabItemComponent {
  @Input() selected: boolean;
}
