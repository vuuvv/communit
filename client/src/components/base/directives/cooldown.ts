import { Directive, Injectable, Input, Output, HostListener, ElementRef, EventEmitter } from '@angular/core';

@Directive({
  selector: '[v-cooldown]',
})
export class CooldownDirective {
  @Input('v-cooldown') duration: number = 60;
  @Output('act') act = new EventEmitter();

  running: boolean = false;

  constructor(private elementRef: ElementRef) {
  }

  @HostListener('click')
  onClick() {
    if (this.running) {
      return;
    }

    let dom = this.elementRef.nativeElement;
    let oldText = dom.innerHTML;
    let i = this.duration;

    let valid = { success: true };
    let ret = this.act.emit(valid);
    if (!valid.success) {
      return;
    }
    this.running = true;

    dom.innerHTML = i;
    let timer = setInterval(() => {
      dom.innerHTML = i - 1;
      i--;
      if (i === 0) {
        clearInterval(timer);
        dom.innerHTML = oldText;
        this.running = false;
      }
    }, 1000);
  }
}
