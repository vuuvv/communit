import { Component, Input, Output, EventEmitter, ViewEncapsulation, OnInit } from '@angular/core';
import { WechatService, Http } from '../services';

@Component({
  selector: 'wechat-uploader',
  templateUrl: './wechat-uploader.html',
  styleUrls: ['./wechat-uploader.less'],
  encapsulation: ViewEncapsulation.None,
  exportAs: 'wechat-uploader'
})
export class WechatUploaderComponent implements OnInit {
  @Input() tip: string;
  @Input() alwaysNull = false;
  @Input() serverId: string;
  @Output() serverIdChange = new EventEmitter();
  @Output() hit = new EventEmitter();
  previewUrl: string;

  constructor(
    private wechatService: WechatService,
  ) {}

  ngOnInit() {
    if (!this.alwaysNull && this.serverId) {
      this.wechatService.previewUrl(this.serverId).then((v) => {
        this.previewUrl = v;
      });
    }
  }

  chooseImage() {
    return this.wechatService.chooseImage()
      .then((localIds) => this.wechatService.uploadImage(localIds[0]))
      .then((serverId) => {
        if (!this.alwaysNull) {
          this.serverId = serverId;
          this.wechatService.previewUrl(serverId).then((v) => {
            this.previewUrl = v;
            console.log(this.previewUrl);
            return this.previewUrl;
          });
        }

        this.serverIdChange.emit(serverId);
      });
  }

  click() {
    this.hit.emit(this);
  }
}
