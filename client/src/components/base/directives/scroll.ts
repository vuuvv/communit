import { Directive, ElementRef, AfterViewInit, Input, Output, EventEmitter } from '@angular/core';
const BSCroll = require('better-scroll');

@Directive({
  selector: '[v-scroll]',
  exportAs: 'v-scroll',
})
export class BScrollDirective implements AfterViewInit {
  @Input() scrollOptions = {};

  @Output() beforeScrollStart = new EventEmitter();
  @Output() scrollStart = new EventEmitter();
  @Output() scroll = new EventEmitter();
  @Output() scrollCancel = new EventEmitter();
  @Output() scrollEnd = new EventEmitter();
  @Output() flick = new EventEmitter();
  @Output() refresh = new EventEmitter();
  @Output() destroy = new EventEmitter();

  bscroll: any;

  constructor(private elementRef: ElementRef) {
  }

  ngAfterViewInit() {
    let scroll = this.bscroll = new BSCroll(this.elementRef.nativeElement, this.scrollOptions);
    scroll.on('beforeScrollStart', (event) => { this.beforeScrollStart.emit(event); });
    scroll.on('scrollStart', (event) => { this.scrollStart.emit(event); });
    scroll.on('scroll', (event) => { this.scroll .emit(event); });
    scroll.on('scrollCancel', (event) => { this.scrollCancel.emit(event); });
    scroll.on('scrollEnd', (event) => { this.scrollEnd.emit(event); });
    scroll.on('flick', (event) => { this.flick.emit(event); });
    scroll.on('refresh', (event) => { this.refresh.emit(event); });
    scroll.on('destroy', (event) => { this.destroy.emit(event); });
  }

  reload() {
    if (this.bscroll) {
      this.bscroll.refresh();
    }
  }

  getCurrentPage() {
    return this.bscroll.getCurrentPage().pageX;
  }
}
