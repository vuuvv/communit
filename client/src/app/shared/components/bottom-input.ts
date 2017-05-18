import { Component, Input, EventEmitter, Output, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'bottom-input',
  templateUrl: './bottom-input.html',
  styleUrls: ['./bottom-input.less'],
  encapsulation: ViewEncapsulation.None,
})
export class BottomInputComponent {
  @Output() submit = new EventEmitter();

  value: any = '';

  resize(ev) {
    ev.target.style.height = 'auto';
    ev.target.style.height = ev.target.scrollHeight + 'px';
  }

  delayResize(ev) {
    setTimeout(() => {
      this.resize(ev);
    }, 0);
  }

  do() {
    this.submit.emit(this.value);
  }

  clear() {
    this.value = '';
  }
}
