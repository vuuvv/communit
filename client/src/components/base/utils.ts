import { ElementRef } from '@angular/core';

export function cooldown(ref: ElementRef, duration: number, done: any) {
    let dom = ref.nativeElement;
    let oldText = dom.innerHTML;
    let i = duration;

    dom.innerHTML = i;
    let timer = setInterval(() => {
      dom.innerHTML = i - 1;
      i--;
      if (i === 0) {
        clearInterval(timer);
        dom.innerHTML = oldText;
        done();
      }
    }, 1000);
}
