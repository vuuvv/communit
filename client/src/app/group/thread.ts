import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';

import { Http, WechatService } from '../shared';
import { OverlayService, DialogService } from '../../components';

@Component({
  templateUrl: './thread.html',
  styleUrls: ['./thread.less'],
  encapsulation: ViewEncapsulation.None,
})
export class ThreadComponent implements OnInit {
  thread: any;
  uploader: any;
  index = 1;

  constructor(
    private http: Http,
    private wechatService: WechatService,
    private overlayService: OverlayService,
    private route: ActivatedRoute,
    private dialogService: DialogService,
  ) {}


  ngOnInit() {
    this.overlayService.loading();
    this.route.params.concatMap((params: Params) => {
      return this.http.get(`/organization/thread/item/${params['id']}`);
    }).subscribe((value: any) => {
      this.overlayService.hideToast();
      this.thread = value;
      this.thread.images = JSON.parse(this.thread.images);
    });
  }

  clickItem(values, images) {
    this.uploader = values[0];
    this.index = values[1];
    this.wechatService.previewImage(images, this.index || 0);
  }

  resize(ev) {
    ev.target.style.height = 'auto';
    ev.target.style.height = ev.target.scrollHeight + 'px';
  }

  delayResize(ev) {
    setTimeout(() => {
      this.resize(ev);
    }, 0);
  }

  reloadRank() {
    this.http.get(`/organization/thread/item/${this.thread.id}`).subscribe((v: any) => {
      this.thread.goodCount = v.goodCount;
      this.thread.badCount = v.badCount;
    });
  }

  good() {
    this.http.post(`/organization/thread/item/${this.thread.id}/good`).subscribe((v) => {
      this.thread.rankType = v;
      this.reloadRank();
    });
  }

  bad() {
    this.http.post(`/organization/thread/item/${this.thread.id}/bad`).subscribe((v) => {
      this.thread.rankType = v;
      this.reloadRank();
    });
  }

  addComment(comment) {
    if (!comment) {
      this.dialogService.alert('请填写评论内容');
      return;
    }

    this.overlayService.loading();
    this.http.json(`/organization/thread/item/${this.thread.id}/comment/add`, {content: comment}).subscribe((v) => {
      this.overlayService.hideToast();
      this.http.get(`/organization/thread/item/${this.thread.id}`).subscribe((value: any) => {
        this.thread.comments = value.comments;
        this.thread.commentCount = value.commentCount;
      });
    });
  }
}
