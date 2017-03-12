import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, Params } from'@angular/router';

import { Http } from '../shared';
import { OverlayService } from '../../components';

@Component({
  templateUrl: './service.html',
  styleUrls: ['./service.less'],
  encapsulation: ViewEncapsulation.None,
})
export class ServiceComponent implements OnInit {
  service: any;
  details: any[] = [];

  constructor(
    private http: Http,
    private route: ActivatedRoute,
    private overlayService: OverlayService,
  ) {}

  ngOnInit() {
    this.overlayService.loading();
    this.route.params.concatMap((params: Params) => {
      return this.http.get(`/service/item/${params['id']}`);
    }).subscribe((service) => {
      this.overlayService.hideToast();
      this.service = service;
      this.parseData();
    });
  }

  parseData() {
    let fields = JSON.parse(this.service.fields);
    let contents = JSON.parse(this.service.content);

    this.details = fields.map((f) => {
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
