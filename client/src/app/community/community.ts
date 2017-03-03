import { Component, Type } from '@angular/core';

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
    title: '戎苑播报：戎苑社区召开社区年终总结大会',
    desc: '1月20日上午，戎苑社区组织居民代表召开了2016年年终总结大会并接受考核。会上，社区党委书记、主任曹淑萍首先对本社区全年工作进行汇报',
    url: '/component/cell'
  }, {
    src: 'http://placeholder.qiniudn.com/60x60/3cc51f/ffffff',
    title: '东城街道58社区组织开展道德讲堂活动',
    desc: '“积善之家必有余庆，殃恶之家必有余殃”...58社区居民活动中心传来阵阵诵经声。原来是58社区于1月11日下午四时，在社区活动中心组织开展道德讲堂活动，社区退休党员和居民近40多人参加了道德讲堂活动。',
    url: '/component/cell'
  }, {
    src: 'http://placeholder.qiniudn.com/60x60/3cc51f/ffffff',
    title: '美丽社区我的家 清扫积雪靠大家',
    desc: '2017年1月9日上午，东城街道58社区的小广场，热火劳动的场面吸引了过路人，看有70多岁老汉、60的岁退休工人，30多岁的年轻人拿着铁锹、推雪板在热火朝天的铲雪大家都砸东铲右推，',
    url: '/component/cell'
  }, {
    src: 'http://placeholder.qiniudn.com/60x60/3cc51f/ffffff',
    title: '党员观看专题片《打铁还需自身硬》',
    desc: '1月16日，彩香一村三区社区党委分别组织各党支部收看专题片《打铁还需自身硬》，专题片共分三篇：上篇《信任不能代替监督》，中篇《严防“灯下黑”》，下篇《以担当诠释忠诚》。',
    url: '/component/cell'
  }, {
    src: 'http://placeholder.qiniudn.com/60x60/3cc51f/ffffff',
    title: '“送法进家庭，维权在身边”宣讲活动',
    desc: '2017年1月11日下午，东城街道58社区开展了以“送法进家庭，维权在身边”为主题的维权大讲堂活动。辖区内30多名妇女同胞参加了此次法制讲堂。',
    url: '/component/cell'
  }, {
    src: 'http://placeholder.qiniudn.com/60x60/3cc51f/ffffff',
    title: '迎春送福 便民服务进社区',
    desc: '2017年新春佳节即将来临，为了丰富社区文化生活，1月18日上午，竹岛街道富华、望海、福海、山海、开园、黄山社区党总支联合威海晚报、404医院等志愿者、党员们在社区活动室开展了“新春祝福、送对联”、“小姜”家电免费维修、清洗首饰、健康义诊等活动。',
    url: '/component/cell'
  }, {
    src: 'http://placeholder.qiniudn.com/60x60/3cc51f/ffffff',
    title: '关爱留守儿童 为留守儿童辅导功课',
    desc: '为做好辖区内留守儿童的关爱活动，使辖区内的留守儿童感受到温暖，10月18日，我社区组织志愿者开展关爱留守儿童活动。',
    url: '/component/cell'
  }, {
    src: 'http://placeholder.qiniudn.com/60x60/3cc51f/ffffff',
    title: '十六社区开展“写春联 送祝福” 弘扬传统文化活动',
    desc: '为迎接即将到来的新春佳节，2017年1月19日新城街道十六社区开展“写春联 送祝福”活动。社区书法家陈宽义和10多名书法爱好学生参加了此项活动。',
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
    });
  }
}
