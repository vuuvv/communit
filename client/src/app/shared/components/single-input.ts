import { Component, Input, EventEmitter, Output, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'single-input',
  templateUrl: './single-input.html',
  styleUrls: ['./single-input.less'],
  encapsulation: ViewEncapsulation.None,
})
export class SingleInputComponent {
  @Input() text: string;
  @Output() textChange = new EventEmitter();

  resize(ev) {
    ev.target.style.height = 'auto';
    ev.target.style.height = ev.target.scrollHeight + 'px';
  }

  delayResize(ev) {
    setTimeout(() => {
      this.resize(ev);
    }, 0);
  }

  onChange(ev) {
    this.text = ev.target.value;
    this.textChange.emit(this.text);
    this.resize(ev);
  }
}
