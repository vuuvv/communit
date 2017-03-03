import { Component, Input, ViewEncapsulation, ViewChild, ElementRef, AfterViewInit, OnChanges, SimpleChanges } from '@angular/core';
import { BScrollDirective } from '../base';

@Component({
  selector: 'v-slider',
  templateUrl: './slider.html',
  styleUrls: ['./slider.less'],
  encapsulation: ViewEncapsulation.None,
})
export class SliderComponent implements AfterViewInit {
  @Input() speed: number = 400;
  @Input() auto: boolean = true;
  @Input() indicator: boolean = true;

  @ViewChild('content') contentRef: ElementRef;
  @ViewChild('viewport') viewportRef: ElementRef;
  @ViewChild(BScrollDirective) scroll: BScrollDirective;

  pages: number = 0;

  ngAfterViewInit() {
    let viewportDom = this.viewportRef.nativeElement;
    let contentDom = this.contentRef.nativeElement;

    let width = parseInt(window.getComputedStyle(viewportDom).width, 10);
    let items = contentDom.children;
    let length = this.pages = items.length;
    let contentWidth = width * length;

    contentDom.style.width = contentWidth + 'px';

    for (let i = 0; i < length; i++) {
      items[i].style.width = width + 'px';
    }

    this.scroll.reload();
  }

  autoScroll() {
    if (!this.auto) {
      return;
    }
  }

  get page() {
    return this.scroll.getCurrentPage();
  }
}

@Component({
  selector: 'v-slider-item',
  template: '<ng-content></ng-content>',
})
export class SliderItemComponent {
}
