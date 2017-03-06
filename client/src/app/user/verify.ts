import { Component } from '@angular/core';
import { Router } from '@angular/router';

import { Http } from '../shared';
import { DialogService } from '../../components';

@Component({
  templateUrl: './verify.html',
  styleUrls: ['./verify.less'],
})
export class VerifyComponent {
  verify: any = {};
  cooldown: boolean;

  constructor(
    private http: Http,
    private router: Router,
    private dialogService: DialogService,
  ) {
  }

  submit() {
    this.http.json('/signup/verify', this.verify).subscribe((value) => {
      this.router.navigate(['/user/signup']);
    });
  }

  getCode(valid) {
    if (!this.verify.tel) {
      valid.success = false;
      this.dialogService.alert('请填写您的手机号码', '错误');
      return;
    }
    return 'get code return';
  }
}
