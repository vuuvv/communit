import { Component, Input } from '@angular/core';

@Component({
  selector: 'v-icon',
  templateUrl: './icon.html',
  host: {
    '[class]': 'iconClass',
    '[style.color]': 'color',
    '[style.background]': 'bg',
    '[style.font-size]': 'size',
  },
})
export class IconComponent {
  @Input() type: string;
  @Input() bg: string;
  @Input() color: string;
  @Input() size: string = '16px';

  get iconClass(): string {
    return `ngv-icon icon-${this.type}`;
  }
}
