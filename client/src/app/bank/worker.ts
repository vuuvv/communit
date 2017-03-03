import { Component } from '@angular/core';
import { isEmptyArray } from '../shared';

@Component({
  templateUrl: './worker.html',
})
export class WorkerComponent {
  private tabs = ['社工机构', '社团组织', '专业社工'];
  private organization = [];
  private society = [];
  private workers = [];

  private type = 1;

  get isEmpty() {
    return (this.type === 1 && isEmptyArray(this.organization)) ||
      (this.type === 2 && isEmptyArray(this.society)) ||
      (this.type === 3 && isEmptyArray(this.workers));
  }
}
