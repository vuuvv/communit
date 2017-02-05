import { Component, Input, Output, EventEmitter, ViewEncapsulation } from '@angular/core';
import { Location } from '@angular/common';

@Component({
  selector: 'v-header',
  templateUrl: './header.html',
  styleUrls: ['./header.less'],
  encapsulation: ViewEncapsulation.None,
})
export class HeaderComponent {
  @Input() title: string;
  @Input() showBack: boolean = true;
  @Input() backText: string = '';
  @Input() showMore: boolean = false;

  @Output('more') moreEvent = new EventEmitter();

  constructor(private location: Location) {
  }

  back(event) {
    this.location.back();
  }

  more(event) {
    this.moreEvent.emit(event);
  }
}
