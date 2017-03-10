import { Component, Input } from '@angular/core';

@Component({
  selector: 'v-icon',
  templateUrl: './icon.html',
  host: {
    '[class]': 'iconClass',
    '[style.color]': 'color',
    '[style.background]': 'bg',
  },
})
export class IconComponent {
  @Input() type: string;
  @Input() bg: string;
  @Input() color: string;
  @Input() headerButton: boolean = false;

  get iconClass(): string {
    let ret = `ngv-icon icon-${this.type}`;
    if (this.headerButton) {
      ret += ' ngv-header-button';
    }
    return ret;
  }
}
