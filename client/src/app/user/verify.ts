import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';

import { Http } from '../shared';
import { DialogService, OverlayService } from '../../components';

@Component({
  templateUrl: './verify.html',
  styleUrls: ['./verify.less'],
})
export class VerifyComponent implements OnInit {
  verify: any = {};
  cooldown: boolean;
  communityId: string;

  constructor(
    private http: Http,
    private router: Router,
    private route: ActivatedRoute,
    private dialogService: DialogService,
    private overlayService: OverlayService,
  ) {
  }

  ngOnInit() {
  }

  submit() {
    this.overlayService.loading();
    this.http.json('/signup/verify', this.verify).subscribe((value) => {
      this.router.navigate([`/user/signup`]);
    });
  }

  getCode(valid) {
    if (!this.verify.tel) {
      valid.success = false;
      this.dialogService.alert('请填写您的手机号码', '错误');
      return;
    }
    this.http.get('/signup/verify/send', {phone: this.verify.tel}).subscribe((value) => {
    });
  }
}
