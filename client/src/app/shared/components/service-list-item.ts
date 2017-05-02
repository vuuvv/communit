import { Component, Input, ViewEncapsulation } from '@angular/core';

const status = {
  'normal': '正常',
  'closed': '已关闭',
};

const CustomType = '33ef69e8e2cc4cf3a9f12c36b560ee73';
const HelpType = '8c4075759d914b1395b8b06bc1b5d19f';

@Component({
  selector: 'service-list-item',
  templateUrl: './service-list-item.html',
  styleUrls: ['./service-list-item.less'],
  encapsulation: ViewEncapsulation.None,
})
export class ServiceListItemComponent {
  @Input() service: any;
  @Input() isMine = false;

  // get src() {
  //   let icon: string = this.service.typeIcon;
  //   if (!icon) {
  //     return null;
  //   }

  //   if (icon.startsWith('http://')) {
  //     return icon;
  //   }
  //   return `assets/images/ios/@2x/${icon}@2x.png`;
  // }

  get status() {
    if (this.service && this.service.status) {
      return status[this.service.status] || '未知';
    }
    return '未知';
  }

  /**
   *
   * @param d00 服务自选，用户
   * @param d01 服务自选，提供方
   * @param d10 邻里自助, 用户
   * @param d11 邻里自助, 提供方
   */
  getServiceData(d00, d01, d10, d11) {
    if (this.service.categoryId === CustomType) {
      return this.isMine ? d01 : d00;
    } else {
      return this.isMine ? d11 : d10;
    }
  }

  get customServiceCount() {
    return `${this.service.submitCount}人报名, ${this.service.acceptCount}人确认, ${this.service.doneCount}人已完成`;
  }

  get title() {
    return this.getServiceData(this.service.userName, this.service.data.content, this.service.userName, this.service.data.content);
  }

  get desc() {
    return this.getServiceData(this.service.data.content, this.customServiceCount, this.service.data.content, this.customServiceCount);
  }

  get meta() {
    return `${this.service.points}积分`;
  }

  get type() {
    return this.getServiceData(this.service.categoryName, this.service.typeName, this.service.categoryName, this.service.typeName);
  }

  get bottomRight() {
    return this.getServiceData(this.service.childTypeName, this.status, this.service.childTypeName, this.status);
  }
}
