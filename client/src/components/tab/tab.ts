import { Component, Input, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'v-tab',
  templateUrl: './tab.html',
  styleUrls: ['./tab.less'],
  encapsulation: ViewEncapsulation.None,
  host: {
    '[class.ngv-tab]': 'true',
    '[class.ngv-tab-no-animate]': '!animate',
  }
})
export class TabComponent {
  @Input() animate: boolean = false;
}

@Component({
  selector: 'v-tab-item',
  templateUrl: './tab-item.html',
  host: {
    '[class.ngv-tab-item]': 'true',
    '[class.ngv-tab-selected]': 'selected',
  }
})
export class TabItemComponent {
  @Input() selected: boolean;
}
