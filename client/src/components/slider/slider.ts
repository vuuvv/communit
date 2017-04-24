import { Component, Input, ViewEncapsulation, ViewChild, ElementRef, AfterViewInit, OnChanges, SimpleChanges } from '@angular/core';
import { BScrollDirective } from '../base';

@Component({
  selector: 'v-slider',
  templateUrl: './slider.html',
  styleUrls: ['./slider.less'],
  encapsulation: ViewEncapsulation.None,
  host: {
    '[class.ngv-slider-vertical]': 'isVertical',
  }
})
export class SliderComponent implements AfterViewInit {
  @Input() speed: number = 400;
  @Input() auto: number = 0;
  @Input() indicator: boolean = true;
  @Input() isVertical = false;

  @ViewChild('content') contentRef: ElementRef;
  @ViewChild('viewport') viewportRef: ElementRef;
  @ViewChild(BScrollDirective) scroll: BScrollDirective;

  pages: number = 0;

  itemsLength: number = 0;

  autoTimer: any;

  ngAfterViewInit() {
    this.reload();
  }

  reload() {
    let viewportDom = this.viewportRef.nativeElement;
    let contentDom = this.contentRef.nativeElement;

    let items = contentDom.children;
    let length = this.itemsLength = items.length;

    if (this.isVertical) {
      let height = parseInt(window.getComputedStyle(viewportDom).height, 10);
      let contentHeight = height * length;
      contentDom.style.height = contentHeight + 'px';

      for (let i = 0; i < length; i++) {
        items[i].style.height = height + 'px';
      }
    } else {
      let width = parseInt(window.getComputedStyle(viewportDom).width, 10);
      let contentWidth = width * length;
      contentDom.style.width = contentWidth + 'px';

      for (let i = 0; i < length; i++) {
        items[i].style.width = width + 'px';
      }
    }

    this.scroll.reload();

    setTimeout(() => {
      this.pages = this.itemsLength;
      this.autoScroll();
    });
  }

  autoScroll() {
    if (!this.auto) {
      return;
    }

    clearInterval(this.autoTimer);
    this.autoTimer = setInterval(() => {
      this.scroll.next();
    }, this.auto);
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
