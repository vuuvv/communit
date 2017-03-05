import { Component, Input, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'service-list-item',
  templateUrl: './service-list-item.html',
  styleUrls: ['./service-list-item.less'],
  encapsulation: ViewEncapsulation.None,
})
export class ServiceListItemComponent {
  @Input() icon: string;
  @Input() title: string;
  @Input() desc: string;
  @Input() meta: string;
  @Input() type: string;
  @Input() status: string;

  get src() {
    if (this.icon) {
      return `assets/images/ios/@2x/${this.icon}@2x.png`;
    } else {
      return null;
    }
  }
}
