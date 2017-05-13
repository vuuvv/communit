import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';

import { Http, WechatService } from '../shared';
import { OverlayService, DialogService } from '../../components';

@Component({
  templateUrl: './thread-add.html',
  styleUrls: ['./thread-add.less'],
  encapsulation: ViewEncapsulation.None,
})
export class ThreadAddComponent implements OnInit {
  organizationId: string;
  thread: any = {};
  actionsShownn = false;

  serverIds: string[] = [];
  actionsShown = false;
  uploader;
  index;

  constructor(
    private http: Http,
    private wechatService: WechatService,
    private overlayService: OverlayService,
    private route: ActivatedRoute,
    private dialogService: DialogService,
    private router: Router,
  ) {}


  ngOnInit() {
    this.overlayService.loading();
    this.route.params.forEach((params: Params) => {
      this.overlayService.hideToast();
      this.organizationId = params['id'];
    });
  }

  clickItem(values) {
    this.actionsShown = true;
    this.uploader = values[0];
    this.index = values[1];
  }

  selectPhoto() {
    if (this.serverIds && this.serverIds.length > 8) {
      this.dialogService.alert('最多只能上传9张图片');
      return;
    }
    this.actionsShown = false;
    this.uploader.chooseImage();
  }

  previewPhotos() {
    this.actionsShown = false;
    this['wechatService'].previewImage(this.serverIds, this.index || 0);
  }

  deletePhoto() {
    this.actionsShown = false;
    if (this.uploader) {
      this.serverIds.splice(this.index, 1);
    }
  }

  submit() {
    if (!this.thread) {
      return;
    }

    if (!this.thread.title) {
      this.dialogService.alert('请填写标题');
      return;
    }

    if (!this.thread.content) {
      this.dialogService.alert('请填写内容')
      return;
    }

    const data = Object.assign({}, this.thread, {serverIds: this.serverIds || []});

    this.overlayService.loading();
    this.http.json(`/organization/${this.organizationId}/thread/add`, data).subscribe(() => {
      this.overlayService.hideToast();
      this.overlayService.toast('主题帖创建成功');
      this.router.navigate([`/group/item/${this.organizationId}`]);
    });
  }
}
