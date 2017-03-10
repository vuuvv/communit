import { Component, ViewEncapsulation, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { Http } from '../shared';
import { OverlayService } from '../../components';

@Component({
  templateUrl: './bank.html',
  styleUrls: ['./bank.less'],
  encapsulation: ViewEncapsulation.None,
})
export class BankComponent implements OnInit {
  private list = [{
    id: '1',
    organization: '老年人协会',
    date: '2017-03-10',
    src: '',
    title: '永久公益心理咨询',
    desc: '这是一个意义危机的时代，情感无归的时代，个体几乎被无视的时代……在帝都更甚。心灵迫切需要在这样的沙漠中找到一块小小的绿洲，可以体验生命之美，情感之美，爱之美。',
    url: ''
  }, {
    src: '',
    title: '十八里店福寿老年公寓关爱',
    desc: '2017年1月21日（周六）上午我们的爱—手拉手义工团将继续福寿老年公寓活动。时间是从8：30-11:00。',
    url: ''
  }, {
    src: '',
    title: '“青芒力量”——艺术青年公益纪录计划',
    desc: '参与者在业余（课余）时间共同收集和帮扶具有潜力且执着于创作的艺术青年，共同以影像拍摄、集体作品展览等方式进行帮助。 ',
    url: ''
  }, {
    src: '',
    title: '关于哀伤的心理成长小组 第三期',
    desc: '生老病死是人生的常态，亲人离世带来的哀伤是人生的课题之一。尽管很多人不愿意触及，但是哀伤仍然是我们需要面对的。有一项研究表明：失去至亲后平均需要2年左右我们才能在公开场合谈及而不再落泪。如果由于痛苦难以承受而采取回避、压抑的应对方法，却可能使得这种由哀伤引起的影响更加深远。 ',
    url: ''
  }, {
    src: '',
    title: '寒假返乡活动，大学生志愿者招募活动开始了！',
    desc: '红心相通公益基金是中国红十字基金会进行贫困患者大病救助的专项基金。为了减轻中国慢乙肝患者长期用药重担，针对性地发起了慢乙肝药品公益援助，并深入乡镇开展宣传工作。加入我们的志愿者团队 ',
    url: ''
  }, {
    src: '',
    title: 'ABC2017年春季咨询季志愿者招募函',
    desc: '在中国，几百万个公益机构，专注于医疗、环保、扶贫、教育等多个领域。但受限于专业人才的长期缺乏，社会薄弱的支持体系，这些努力推进社会发展的公益组织，在自身可持续发展方面存在着大量的困难。 ',
    url: ''
  }, {
    src: '',
    title: '长假做一件帅酷的毛呢马甲，感受一针一线的温暖',
    desc: '想要拥有俐落时髦感，既能御寒,又不会显得过于臃肿，那么这种帅气的风格西装版背心款式就非他莫属啦！ 搭配上高领毛衣，或者小脚裤，通过多层次的穿搭，拉伸你的身体曲线，而且上班或者去约会都完全能hole.让你的日常搭配更富有变化哦！',
    url: ''
  }, {
    src: '',
    title: '红心相通公益基金恩替卡韦公益援助~邀你来',
    desc: '红心相通公益基金恩替卡韦药品援助项目，旨在为中国的乙肝患者获得可及性治疗方面提供帮助，最大程度上满足更多中国乙肝患者的用药需求，为中国消除乙肝，奉献一份力量。',
    url: ''
  }, {
    src: 'http://placeholder.qiniudn.com/60x60/3cc51f/ffffff',
    title: '戎苑播报：戎苑社区召开社区年终总结大会',
    desc: '1月20日上午，戎苑社区组织居民代表召开了2016年年终总结大会并接受考核。会上，社区党委书记、主任曹淑萍首先对本社区全年工作进行汇报',
    url: '/component/cell'
  }];

  menus: any[] = [];
  activeMenuId: string;

  constructor(
    private http: Http,
    private router: Router,
    private overlayService: OverlayService,
  ) {}

  ngOnInit() {
    this.overlayService.loading();
    this.http.get('/menu/bank').subscribe((resp: any) => {
      this.menus = resp;
      let roots = this.getMenus();
      for (let i = 0; i < roots.length; i++) {
        if (this.hasChilrend(roots[i])) {
          this.activeMenuId = roots[i].id;
          break;
        }
      }
      this.overlayService.hideToast();
    });
  }

  getMenus(pid = null) {
    if (!this.menus) {
      return [];
    }

    let ret = this.menus.filter((item) => {
      return item.parentId == pid;
    });

    return ret;
  }

  hasChilrend(menu) {
    return this.getMenus(menu.id).length > 0;
  }

  clickMainMenu(m) {
    if (m.url) {
      this.router.navigate([m.url]);
      return;
    }
    this.activeMenuId = m.id;
  }

  click() {
    console.log('click');
  }
}
