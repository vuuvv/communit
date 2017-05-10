import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { NgForm } from '@angular/forms';

import { Http, FormService } from '../shared';
import { buildUrl } from '../utils';
import { DialogService, OverlayService } from '../../components';

@Component({
  templateUrl: './verify.html',
  styleUrls: ['./verify.less'],
})
export class VerifyComponent implements OnInit {
  verify: any = {};
  cooldown: boolean;
  communityId: string;
  capchaUrl = null;

  validMessages = {
    tel: {
      required: '请填写手机号',
    },
    code: {
      required: '请填写手机验证码',
    },
    capcha: {
      required: '请填写图形验证码',
    }
  };

  constructor(
    private http: Http,
    private router: Router,
    private route: ActivatedRoute,
    private dialogService: DialogService,
    private overlayService: OverlayService,
    private formService: FormService,
  ) {
  }

  ngOnInit() {
    this.capchaUrl = this.getCapchaUrl();
  }

  submit(form: NgForm) {
    this.formService.submit(form, this.validMessages, '/signup/verify', this.verify).subscribe(() => {
      this.router.navigate([`/user/signup`]);
    });
  }

  getCode(valid) {
    if (!this.verify.tel) {
      valid.success = false;
      this.dialogService.alert('请填写手机号码', '错误');
      return;
    }
    if (!this.verify.capcha) {
      valid.success = false;
      this.dialogService.alert('请填写图形验证码', '错误');
      return;
    }
    this.http.get('/signup/verify/send', {phone: this.verify.tel, capcha: this.verify.capcha}).subscribe((value) => {
    }, undefined, () => {
      this.capchaUrl = this.getCapchaUrl();
    });
  }

  getCapchaUrl() {
    return buildUrl('/capcha', null);
  }

  changeCapcha() {
    this.capchaUrl = this.getCapchaUrl();
  }
}
