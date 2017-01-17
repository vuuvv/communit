import { Component, Input } from '@angular/core';

@Component({
  selector: 'v-icon',
  templateUrl: './icon.html',
  host: {
    '[class]': "iconClass",
  },
})
export class IconComponent {
  @Input() type: string;

  get iconClass(): string {
    return `ngv-icon icon-${this.type}`;
  }
}
