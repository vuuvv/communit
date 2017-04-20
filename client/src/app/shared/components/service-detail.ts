import { Component, Input, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';


const serviceUserStatus = {
  'submit': '报名中',
  'reject': '已被拒',
  'accept': '已接受接收',
  'done': '交易完成',
  'quit': '已退出',
};

const serviceStatus = {
  'normal': '正常',
  'close': '已关闭',
};


@Component({
  selector: 'service-detail',
  templateUrl: './service-detail.html',
  styleUrls: ['./service-detail.less'],
  encapsulation: ViewEncapsulation.None,
})
export class ServiceDetailComponent {
  @Input() service: any;
  @Input() isMine = false;

  constructor(
    private router: Router
  ) {}

  getUserStatus(status) {
    return serviceUserStatus[status] || '未知';
  }

  gotoUsers(index) {
    if (this.isMine) {
      this.router.navigate([`/user/service/${this.service.id}/users/${index}`]);
    }
  }
}
