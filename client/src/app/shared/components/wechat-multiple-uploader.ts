import { Component, Input, Output, EventEmitter } from '@angular/core';
import { WechatService, Http } from '../services';

@Component({
  selector: 'wechat-uploader',
  templateUrl: './wechat-uploader.html',
  exportAs: 'wechat-uploader'
})
export class WechatMultipleUploaderComponent {
  @Input() tip: string;
  @Input() serverIds: string;
  @Output() serverIdsChange = new EventEmitter();
  previewUrl: string;

  constructor(
    private wechatService: WechatService
  ) {}
}
