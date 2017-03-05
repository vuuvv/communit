import { Component, Input, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'quickentry',
  templateUrl: './quickentry.html',
  styleUrls: ['./quickentry.less'],
  encapsulation: ViewEncapsulation.None,
})
export class QuickentryComponent {
}


@Component({
  selector: 'quickentry-item',
  templateUrl: './quickentry-item.html',
  styleUrls: ['./quickentry-item.less'],
  encapsulation: ViewEncapsulation.None,
})
export class QuickentryItemComponent {
  @Input() icon: string;
  @Input() width: string = '40';
  @Input() height: string = '40';

  get src() {
    return `assets/images/ios/@2x/${this.icon}@2x.png`;
  }
}



