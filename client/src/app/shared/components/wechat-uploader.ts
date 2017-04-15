import { Component, Input, Output, EventEmitter } from '@angular/core';
import { WechatService, Http } from '../services';

@Component({
  selector: 'wechat-uploader',
  templateUrl: './wechat-uploader.html',
  exportAs: 'wechat-uploader'
})
export class WechatUploaderComponent {
  @Input() tip: string;
  @Input() serverId: string;
  @Output() serverIdChange = new EventEmitter();
  previewUrl: string;

  constructor(
    private wechatService: WechatService
  ) {}

  chooseImage(communityId: string = null) {
    return this.wechatService.chooseImage()
      .then((localIds) => this.wechatService.uploadImage(localIds[0]))
      .then((serverId) => {
        this.serverId = serverId;
        this.serverIdChange.emit(serverId);
        let p = communityId ? Promise.resolve(communityId) : this.wechatService.getCommunityId();
        return p.then((id: string) => {
          this.previewUrl = this.wechatService.previewUrl(id, this.serverId);
          return this.previewUrl;
        });
      });
  }
}
