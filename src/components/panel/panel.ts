import { Component, Input, ViewEncapsulation, ViewChild, ElementRef, AfterViewInit } from '@angular/core';

@Component({
  selector: 'v-panel',
  templateUrl: './panel.html',
  styleUrls: ['./panel.less'],
  encapsulation: ViewEncapsulation.None,
  host: {
    '[class.weui-panel]': 'true',
    '[class.weui-panel__access]': 'true',
  }
})
export class PanelComponent implements AfterViewInit {
  hideHeader: boolean = false;

  @Input() type: string = '1';
  @Input() footer: any;
  @Input() list: any[] = [];

  @ViewChild('header') headerElem: ElementRef;

  ngAfterViewInit() {
    const elem = this.headerElem.nativeElement;
    console.log(elem.innerText);
    this.hideHeader = elem.children.length == 0 && (!elem.innerText || /^\s+$/.test(elem.innerText))
  }
}
