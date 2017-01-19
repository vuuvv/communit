import { Component, Input, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'v-panel',
  templateUrl: './panel.html',
  styleUrls: ['./panel.less'],
  encapsulation: ViewEncapsulation.None,
  host: {
    '[class.weui-panel]': 'true',
    '[class.weui-panel__access]': 'true',
  }
})
export class PanelComponent {
  @Input() type: string = '1';
  @Input() header: string;
  @Input() footer: any;
  @Input() list: any[] = [];
}
