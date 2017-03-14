import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { Location } from '@angular/common';

import { Http } from '../shared';
import { OverlayService, DialogService } from '../../components';

@Component({
  templateUrl: './qrcode.html',
  styleUrls: ['./qrcode.less'],
  encapsulation: ViewEncapsulation.None,
})
export class QrcodeComponent implements OnInit {
  qrcode: any;
  value: string;

  constructor(
    private http: Http,
    private router: Router,
    private route: ActivatedRoute,
    private overlayService: OverlayService,
    private dialogService: DialogService,
    private location: Location,
  ) {}

  ngOnInit() {
    this.overlayService.loading();
    this.route.params.concatMap((params: Params) => {
      return this.http.get(`/qr/get/${params['id']}`);
    }).subscribe((resp) => {
      this.overlayService.hideToast();
      this.qrcode = resp;
      this.value = this.http.buildUrl(`/qr/scan/${this.qrcode.id}`);
      if (this.qrcode.status !== 'submit' || new Date(this.qrcode.expiresIn) < new Date()) {
        this.dialogService.alert('二维码已失效').ok((c) => {
          this.location.back();
          c.close();
        }).subscribe(() => {});
      }
    });
  }
}
