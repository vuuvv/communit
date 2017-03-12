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

  @Input() service: any;

  get src() {
    let icon: string = this.service.typeIcon;
    if (!icon) {
      return null;
    }

    if (icon.startsWith('http://')) {
      return icon;
    }
    return `assets/images/ios/@2x/${icon}@2x.png`;
  }
}
