import { Component, Input, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'v-tabbar',
  templateUrl: './tabbar.html',
  styleUrls: ['./tabbar.less'],
  encapsulation: ViewEncapsulation.None,
  host: {
    '[class.weui-tabbar]': 'true',
  },
})
export class TabbarComponent {
}

@Component({
  selector: 'v-tabbar-item',
  templateUrl: './tabbar-item.html',
  host: {
    '[class.weui-tabbar__item]': 'true',
  },
})
export class TabbarItemComponent {
  @Input() badge: string;
  @Input() showDot: boolean = false;
  @Input() hasIcon: boolean = true;
}

@Component({
  selector: 'v-tabbar-btn',
  templateUrl: './tabbar-btn.html',
  host: {
    '[class.weui-tabbar__item]': 'true',
  },
})
export class TabbarButtonComponent {
}
