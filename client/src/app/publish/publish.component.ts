import { Component, ViewChild } from '@angular/core';

const categories = ['我要求助', '我要提供服务', '发起慈善活动'];

@Component({
  templateUrl: './publish.component.html',
  styleUrls: ['./publish.component.less'],
})
export class PublishComponent {
  categories: any = categories;
}
