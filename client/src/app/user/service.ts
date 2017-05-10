import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';

import { isEmptyArray, Http } from '../shared';

import { OverlayService, DialogService } from '../../components';

import { Observable } from 'rxjs/Observable';

@Component({
  templateUrl: './service.html',
})
export class ServiceComponent implements OnInit {
  service: any;

  constructor(
    private router: Router,
    private http: Http,
    private route: ActivatedRoute,
    private overlayService: OverlayService,
    private dialogService: DialogService,
  ) {}

  ngOnInit() {
    this.init();
  }

  init() {
    this.overlayService.loading();
    this.route.params.concatMap((params: Params) => {
      return this.http.get(`/service/item/${params['id']}`);
    }).subscribe((resp: any) => {
      this.overlayService.hideToast();
      this.service = resp.service;
      this.parseData();
    });
  }

  edit() {
  }

  close() {
  }

  parseData() {
    let fields = JSON.parse(this.service.fields);
    let contents = JSON.parse(this.service.content);

    this.service.details = fields.map((f) => {
      let v = contents[f.key];
      return f.key === 'type' ? {
        label: f.label,
        content: this.service.typeName,
        type: f.type,
      } : {
        label: f.label,
        content: v,
        type: f.type,
      };
    });
  }
}
