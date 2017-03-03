import { Component, ViewEncapsulation, Input, HostBinding } from '@angular/core';

function isNumber(num) {
  return /^[-+]?[0-9]+[\.]?[0-9]+$/.test(num);
}

@Component({
  selector: 'v-image',
  templateUrl: './image.html',
  styleUrls: ['./image.less'],
  encapsulation: ViewEncapsulation.None,
})
export class ImageComponent {
  @Input() width: string;
  @Input() height: string;
  @Input() src: string;

  @Input()
  @HostBinding('style.background-size')
  size: string = 'contain';

  @Input()
  @HostBinding('style.background-position')
  position: string = 'center center';

  @Input()
  @HostBinding('style.background-repeat')
  repeat: string = 'no-repeat';

  @HostBinding('style.width')
  get widthStyle() {
    let width = this.width;
    return isNumber(width) ? width + 'px' : width;
  }

  @HostBinding('style.height')
  get heightStyle() {
    let height = this.height;
    return isNumber(height) ? height + 'px' : height;
  }

  @HostBinding('style.background-image')
  get backgroundImageStyle() {
    return `url(${this.src})`;
  }
}
