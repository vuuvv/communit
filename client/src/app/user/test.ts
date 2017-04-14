import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { Location } from '@angular/common';

import { Http, WechatService } from '../shared';
import { OverlayService, DialogService } from '../../components';

@Component({
  templateUrl: './test.html',
  encapsulation: ViewEncapsulation.None,
})
export class TestComponent implements OnInit {
  constructor(
    private http: Http,
    private router: Router,
    private route: ActivatedRoute,
    private overlayService: OverlayService,
    private dialogService: DialogService,
    private location: Location,
    private wechatService: WechatService,
  ) {}

  ngOnInit() {
  }

  chooseImage() {
    /*
    this.wechatService.chooseImage().then((localIds) => {
      console.log(localIds[0]);
      return this.wechatService.uploadImage(localIds[0]);
    }).then((value) => {
      console.log(value);
    });
    */
    this.wechatService.previewImage(['UmScSuhLfWiX-I2cp-bMfoU1SvVVvfTlt4GNTMq8IXsbrSUq2jaG1KOnlKhwIeW1']);
  }
}
