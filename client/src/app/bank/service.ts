import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, Params } from'@angular/router';
import { Router } from '@angular/router';

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
    private router: Router,
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

  get buttonText() {
    let ret = '我要付款';
    if (this.service && this.service.categoryId === '8c4075759d914b1395b8b06bc1b5d19f') {
      ret = '我要收款';
    }
    return ret;
  }

  buy() {
    this.overlayService.loading();
    this.http.post(`/qr/g/service/${this.service.id}`).subscribe((value) => {
      this.overlayService.hideToast();
      this.router.navigate([`/user/qr/${value}`]);
    });
  }
}
