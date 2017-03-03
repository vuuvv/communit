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
  encapsulation: ViewEncapsulation.None,
})
export class QuickentryItemComponent {
  @Input() icon: string;
  @Input() color: string = '#fff';
  @Input() bg: string;
}



