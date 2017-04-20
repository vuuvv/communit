import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';

import { isEmptyArray, Http } from '../shared';

import { OverlayService } from '../../components';

import { Observable } from 'rxjs/Observable';

@Component({
  templateUrl: './worker.html',
})
export class WorkerComponent implements OnInit {
  workers: any[];
  services: any[];
  tabs = ['活动管理', '活动记录', '基本资料'];
  currentIndex = 0;

  constructor(
    private http: Http,
    private overlayService: OverlayService,
    private route: ActivatedRoute,
  ) {}

  ngOnInit() {
    this.overlayService.loading();
    this.route.params.concatMap((params: Params) => {
      this.currentIndex = +params['type'];
      return this.http.get('/user/workers');
    }).concatMap((value: any) => {
      this.workers = value;

      if (this.currentIndex === 0) {
        return this.http.get('/service/list');
      } else if (this.currentIndex === 1) {
        return Observable.of(null);
      } else if (this.currentIndex === 2) {
        return Observable.of(true);
      }
    }).subscribe((value: any) => {
      this.overlayService.hideToast();
      if (this.currentIndex === 0) {
        this.services = value.map((s) => {
          s.data = JSON.parse(s.content);
          return s;
        });
      } else if (this.currentIndex === 1) {
      } else if (this.currentIndex === 2) {
      }
    });
  }

  get isWorker() {
    return this.workers && this.workers.length;
  }

  isSelected(i) {
    return i === this.currentIndex;
  }

  isCurrentIndex(i) {
    console.log(i === this.currentIndex);
    return i === this.currentIndex;
  }
}
