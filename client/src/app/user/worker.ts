import { Component, OnInit } from '@angular/core';

import { isEmptyArray, Http } from '../shared';

import { OverlayService } from '../../components';

@Component({
  templateUrl: './worker.html',
})
export class WorkerComponent implements OnInit {
  workers: any[];
  tabs = ['基本资料', '活动管理', '活动记录'];
  currentIndex;

  constructor(
    private http: Http,
    private overlayService: OverlayService,
  ) {}

  ngOnInit() {
    this.http.get('/user/workers').subscribe((value: any) => {
      this.workers = value;
    });
    setTimeout(() => {
      this.currentIndex = 0;
    }, 0);
  }

  get isWorker() {
    return this.workers && this.workers.length;
  }

  isSelected(i) {
    return i === this.currentIndex;
  }
}
