import { Component } from '@angular/core';

import { OverlayService, DialogService } from '../../components';
import { Http } from '../shared';

@Component({
  templateUrl: './community.html',
  styleUrls: ['./community.less'],
})
export class CommunityComponent {
  private type = '3';
  private list = [{
    src: 'http://placeholder.qiniudn.com/60x60/3cc51f/ffffff',
    title: '标题一',
    desc: '由各种物质组成的巨型球状天体，叫做星球。星球有一定的形状，有自己的运行轨道。',
    url: '/component/cell'
  }, {
    src: 'http://placeholder.qiniudn.com/60x60/3cc51f/ffffff',
    title: '标题二',
    desc: '由各种物质组成的巨型球状天体，叫做星球。星球有一定的形状，有自己的运行轨道。',
    url: {
      path: '/component/radio',
      replace: false
    }
  }];
  private foot = {
    title: '查看更多',
    url: 'http://vux.li'
  };
  constructor(private overlayService: OverlayService, private dialogService: DialogService, private http: Http) {
  }

  toast() {
    this.dialogService.alert('hi');
    this.http.get('http://weixin.vuuvv.com/test').subscribe((value) => {
      console.log(value);
    })
  }
}
