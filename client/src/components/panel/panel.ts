import { Component, Input, ViewEncapsulation, ViewChild, ElementRef, AfterViewInit, OnChanges, SimpleChanges } from '@angular/core';

export class PanelItem {
  title: string;
  desc: string;
  url: string;
  metas: string[];
}

export class PanelItemMapper {
  title: string;
  desc: string;
  url: string;
  metas: string[];
}

function map(src: any, prop: string, mapper: PanelItemMapper) {
  return mapper[prop] ? src[mapper[prop]] : src[prop];
}

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
export class PanelComponent implements AfterViewInit, OnChanges {
  hideHeader: boolean = false;

  @Input() mapper: PanelItemMapper;
  @Input() type: string = '1';
  @Input() footer: any;
  @Input() list: any[] = [];

  panelList: PanelItem[] = [];

  @ViewChild('header') headerElem: ElementRef;

  ngAfterViewInit() {
    const elem = this.headerElem.nativeElement;
    this.hideHeader = elem.children.length === 0 && (!elem.innerText || /^\s+$/.test(elem.innerText));
  }

  ngOnChanges(changes: SimpleChanges) {
    const listValue = changes['list'].currentValue;
    const mapper = this.mapper;
    if (!listValue || !listValue.length) {
      this.panelList = [];
      return;
    }
    if (!mapper) {
      this.panelList = listValue;
      return;
    }

    this.panelList = listValue.map((value) => {
      const ret = new PanelItem();
      ret.title = map(value, 'title', mapper);
      ret.desc = map(value, 'desc', mapper);
      ret.url = map(value, 'url', mapper);
      ret.metas = mapper.metas ? mapper.metas.map((meta) => value[meta]) : value.metas;
      return ret;
    });

    console.log(this.panelList);
  }
}
