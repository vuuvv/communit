import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, Params } from'@angular/router';
import { Router } from '@angular/router';

import { Http, AuthorizeService, sumBy } from '../shared';
import { OverlayService, DialogService } from '../../components';

@Component({
  templateUrl: './service.html',
  styleUrls: ['./service.less'],
  encapsulation: ViewEncapsulation.None,
})
export class ServiceComponent implements OnInit {
  service: any;
  user: any;

  constructor(
    private router: Router,
    private http: Http,
    private route: ActivatedRoute,
    private overlayService: OverlayService,
    private authorizeService: AuthorizeService,
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
      this.user = resp.user;
      this.parseData();
    });
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

  join() {
    this.router.navigate([`/bank/service/${this.service.id}/join`]);
  }

  quit() {
    this.dialogService.confirm('确定要退出该活动？').ok((comp) => {
      comp.close();
      this.overlayService.loading();
      this.http.post(`/service/${this.user.id}/quit`).subscribe(() => {
        this.init();
      });
    });
  }

  qr() {
    if (!this.user.orderId) {
      return;
    }
    this.overlayService.loading();
    this.http.post(`/qr/g/order/${this.user.orderId}`).subscribe((v) => {
      this.overlayService.hideToast();
      this.router.navigate([`/user/qr/${v}`]);
    });
  }
}
