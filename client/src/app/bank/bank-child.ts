import { Component, ViewEncapsulation, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/forkJoin';

import { Http } from '../shared';
import { OverlayService } from '../../components';

@Component({
  templateUrl: './bank-child.html',
  styleUrls: ['./bank-child.less'],
  encapsulation: ViewEncapsulation.None,
})
export class BankChildComponent implements OnInit {
  children: any[];
  menu: any;

  constructor(
    private http: Http,
    private route: ActivatedRoute,
    private overlayService: OverlayService,
  ) {}

  ngOnInit() {
    this.overlayService.loading();
    this.route.params.concatMap((params: Params) => {
      let id = params['id'];
      return Observable.forkJoin(
        this.http.get(`/menu/bank/${id}/children`),
        this.http.get(`/menu/bank/${id}`),
      );
    }).subscribe((values: any) => {
      this.overlayService.hideToast();
      this.children = values[0];
      this.menu = values[1];
    });
  }
}
