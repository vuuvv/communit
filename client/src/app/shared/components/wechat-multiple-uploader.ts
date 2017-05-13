import { Component, Input, Output, EventEmitter, ViewEncapsulation } from '@angular/core';
import { WechatService, Http } from '../services';

@Component({
  selector: 'wechat-multiple-uploader',
  templateUrl: './wechat-multiple-uploader.html',
  styleUrls: ['./wechat-multiple-uploader.less'],
  encapsulation: ViewEncapsulation.None,
})
export class WechatMultipleUploaderComponent {
  @Input() tip: string;
  @Input() serverIds: string[] = [];
  @Input() showAdd = true;
  @Input() showTip = true;
  @Output() serverIdsChange = new EventEmitter();
  @Output() clickItem = new EventEmitter();

  constructor(
    private wechatService: WechatService
  ) {}

  updateServerIds(serverId: string, index: number) {
    console.log(index, serverId);
    if (index === -1) {
      index = this.serverIds.length;
    }
    this.serverIds[index] = serverId;
    console.log(this.serverIds);
    this.serverIdsChange.emit(this.serverIds);
  }

  itemClick(uploader, index) {
    this.clickItem.emit([uploader, index]);
  }
}
