import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';

import { Http, WechatService } from '../shared';
import { OverlayService, DialogService } from '../../components';

@Component({
  templateUrl: './group.html',
  styleUrls: ['./group.less'],
  encapsulation: ViewEncapsulation.None,
})
export class GroupComponent implements OnInit {
  organization: any;
  serverIds = [
    'http://img1.gtimg.com/gongyi/pics/hv1/62/194/2119/137837507.jpg',
    'http://img1.gtimg.com/gongyi/pics/hv1/93/106/2209/143667348.jpg',
    'http://img1.gtimg.com/gongyi/pics/hv1/29/71/2209/143658359.jpg',
    'http://img1.gtimg.com/gongyi/pics/hv1/244/11/2208/143578249.jpg'
  ];

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
      return this.http.get(`/organization/item/${params['id']}`);
    }).subscribe((value: any) => {
      this.overlayService.hideToast();
      this.organization = value;
      this.organization.threads.forEach((v) => {
        v.images = JSON.parse(v.images);
      });
    });
  }

  clickItem(values) {
    this.uploader = values[0];
    this.index = values[1];
    this.wechatService.previewImage(this.serverIds, this.index || 0);
  }

  join() {
    if (!this.organization) {
      return;
    }
    this.dialogService.confirm('确认加入').ok((comp) => {
      comp.close();
      this.overlayService.loading();
      this.http.post(`/organization/join/${this.organization.id}`).subscribe((value: any) => {
        this.overlayService.toast('加入成功');
        this.organization.isJoined = true;
      });
    });
  }

  quit() {
    if (!this.organization) {
      return;
    }
    this.dialogService.confirm('确认退出').ok((comp) => {
      comp.close();
      this.overlayService.loading();
      this.http.post(`/organization/quit/${this.organization.id}`).subscribe((value: any) => {
        this.overlayService.toast('退出成功');
        this.organization.isJoined = false;
      });
    });
  }
}
