import { Component, Input, Output, ViewEncapsulation, HostBinding, EventEmitter } from '@angular/core';

@Component({
  selector: 'v-mask',
  templateUrl: './mask.html',
  styleUrls: ['./mask.less'],
  encapsulation: ViewEncapsulation.None,
})
export class MaskComponent {
  @Input()
  @HostBinding('class.ngv-mask-show')
  visible: boolean = false;

  @Output()
  click = new EventEmitter();

  @Input() closeByClickMask: boolean = false;

  onClick(event) {
    if (this.closeByClickMask) {
      this.visible = false;
    }
    this.click.emit(event);
  }

  show() {
    this.visible = true;
  }

  hide() {
    this.visible = false;
  }
}
