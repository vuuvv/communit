import { Component, ViewChild } from '@angular/core';
import { BScrollDirective } from '../../components';

@Component({
  templateUrl: './publish.component.html',
  styleUrls: ['./publish.component.less'],
})
export class PublishComponent {
  @ViewChild('scroll') scroll: BScrollDirective;
  show: boolean = false;

  scrollStart(event) {
    console.log(this.scroll.reload);
    console.log(event);
  }
}
