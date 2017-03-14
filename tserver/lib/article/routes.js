"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
const routes_1 = require("../routes");
const db_1 = require("../db");
let ArticlesController = class ArticlesController {
    async home(ctx) {
        let ret = await db_1.raw(`
      select * from weixin_cms_article as a
      join weixin_cms_menu as m on m.id=a.column_id
      where m.accountid=? and m.name="社区动态" order by a.create_date desc
    `, [ctx.session.communityId]);
        return routes_1.success(ret);
    }
    async item(ctx) {
        const id = ctx.params.id;
        let ret = await db_1.db.raw('select * from weixin_cms_article as a join weixin_cms_menu as m on m.id=a.column_id where m.accountid=? and m.name="社区动态"');
        let articles = [
            {
                title: '戎苑播报：戎苑社区召开社区年终总结大会',
                desc: '1月20日上午，戎苑社区组织居民代表召开了2016年年终总结大会并接受考核。会上，社区党委书记、主任曹淑萍首先对本社区全年工作进行汇报',
                id: '1',
            },
            {
                title: '东城街道58社区组织开展道德讲堂活动',
                desc: '“积善之家必有余庆，殃恶之家必有余殃”...58社区居民活动中心传来阵阵诵经声。原来是58社区于1月11日下午四时，在社区活动中心组织开展道德讲堂活动，社区退休党员和居民近40多人参加了道德讲堂活动。',
                id: '2',
            },
            {
                title: '美丽社区我的家 清扫积雪靠大家',
                desc: '2017年1月9日上午，东城街道58社区的小广场，热火劳动的场面吸引了过路人，看有70多岁老汉、60的岁退休工人，30多岁的年轻人拿着铁锹、推雪板在热火朝天的铲雪大家都砸东铲右推，',
                id: '2',
            },
            {
                title: '党员观看专题片《打铁还需自身硬》',
                desc: '1月16日，彩香一村三区社区党委分别组织各党支部收看专题片《打铁还需自身硬》，专题片共分三篇：上篇《信任不能代替监督》，中篇《严防“灯下黑”》，下篇《以担当诠释忠诚》。',
                id: '2',
            },
            {
                title: '“送法进家庭，维权在身边”宣讲活动',
                desc: '2017年1月11日下午，东城街道58社区开展了以“送法进家庭，维权在身边”为主题的维权大讲堂活动。辖区内30多名妇女同胞参加了此次法制讲堂。',
                id: '2',
            },
            {
                title: '迎春送福 便民服务进社区',
                desc: '2017年新春佳节即将来临，为了丰富社区文化生活，1月18日上午，竹岛街道富华、望海、福海、山海、开园、黄山社区党总支联合威海晚报、404医院等志愿者、党员们在社区活动室开展了“新春祝福、送对联”、“小姜”家电免费维修、清洗首饰、健康义诊等活动。',
                id: '2',
            },
            {
                title: '关爱留守儿童 为留守儿童辅导功课',
                desc: '为做好辖区内留守儿童的关爱活动，使辖区内的留守儿童感受到温暖，10月18日，我社区组织志愿者开展关爱留守儿童活动。',
                id: '2',
            },
            {
                title: '十六社区开展“写春联 送祝福” 弘扬传统文化活动',
                desc: '为迎接即将到来的新春佳节，2017年1月19日新城街道十六社区开展“写春联 送祝福”活动。社区书法家陈宽义和10多名书法爱好学生参加了此项活动。',
                id: '2',
            }
        ];
        return routes_1.success({
            category: '社区概况',
            list: articles,
        });
    }
};
__decorate([
    routes_1.get('/home'),
    routes_1.login,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ArticlesController.prototype, "home", null);
__decorate([
    routes_1.get('/:id'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ArticlesController.prototype, "item", null);
ArticlesController = __decorate([
    routes_1.router('/articles')
], ArticlesController);
exports.ArticlesController = ArticlesController;
let ArticleController = class ArticleController {
    async item(ctx) {
        const id = ctx.params.id;
        let article = {
            id: id,
            title: '商住房该不该买?投资商住房八大风险需警惕!',
            category: '社区动态',
            content: `
      <div class="zs-con"><p>2016年，帝都通州<a data-word="商住房" href="javascript:void(0);" class="ct" style="white-space: nowrap" id="wapzhishixq_D03_01">商住房</a>全面<a data-word="限购" href="javascript:void(0);" class="ct" style="white-space: nowrap" id="wapzhishixq_D03_01">限购</a>的消息在执行前就在网上疯狂转载。受此刺激，投资客纷纷赶上政策末班车，加紧购买商住房，仅一天的签约量就相当于5月全月签约量的60%。面对火热的市场行情，很多人蠢蠢欲动，也有人持观望态度。</p><p>从交易的情况来看，购买商住房的人群一般分为两类：一是不能再购买<a data-word="普通住宅" href="javascript:void(0);" class="ct" style="white-space: nowrap" id="wapzhishixq_D03_01">普通住宅</a>的投资客，二是没有购房资格的自住需求者通过购买商住房来过渡。对于第二者来说，现在该不该买商住房呢？购买商住房是否存在风险呢？</p><img title="商住房该不该买?" alt="商住房该不该买?" class="lazyload" data-original="//cdns.soufunimg.com/imgs/viewimage/news/2017_03/02/zhishi/1488447116112_000/640x480.jpg" type="image" src="//cdns.soufunimg.com/imgs/viewimage/news/2017_03/02/zhishi/1488447116112_000/640x480.jpg" style="display: inline;"><p>商住房，即商住两用房，既可以用作居住用房，又可以注册公司从事商业活动。其本质上属于非住宅，是将非住宅用地开发建设成可居住房屋，而且在<a data-word="房产" href="javascript:void(0);" class="ct" style="white-space: nowrap" id="wapzhishixq_D03_01">房产</a>证上也注明了是商业、办公类<a data-word="产权" href="javascript:void(0);" class="ct" style="white-space: nowrap" id="wapzhishixq_D03_01">产权</a>。</p><p>土地使用权年限，如果40年，就是商住两用房，按照商业用房<a data-word="贷款利率" href="javascript:void(0);" class="ct" style="white-space: nowrap" id="wapzhishixq_D03_01">贷款利率</a>（最低上浮10%），首付5成；如果70年，就是住宅，按照住宅按揭贷款利率（最高下浮30%），大部分城市首付20%（首套）。</p><p>对于商住房有两种解释:一是既可以作店面，又可以作住房(商住两用)；二是楼下是店面,楼上是住房，产权为同一人。</p><p>与普通住宅相比，商住房最大的优点就是价格低。商住公寓一般以高层、小面积为主，容积率较高，售价相对低出不少。对于那些暂时无法承担普通住宅或者没有购房资格的人来说，作为一种过渡型住宅，商住房是一种合适的选择。</p><p>其次，商住房比普通住房高，可隔成两成。如房本面积为60平方米，那么，实际居住面积就可达到120平方米。既然是商住两用房，就可将楼下作为店面，楼上作为住房。如此看来，商住房不仅满足了居住功能，也兼具投资功能。</p><p>与普通住宅相比，商住房购买门槛相对较低。尽管商住房有价格低、不限购的优势，但其缺点也是十分明显的：</p><p>1、商住项目的土地出让年限一般只有40年或50年，普通住宅则是70年；<br></p><p>2、商住房最低首付比例为45%，贷款期限一般不能超过10年，贷款利率不得低于同期同档次利率的1.1倍，且不能使用住房<a data-word="公积金贷款" href="javascript:void(0);" class="ct" style="white-space: nowrap" id="wapzhishixq_D03_01"></a><a data-word="公积金" href="javascript:void(0);" class="ct" style="white-space: nowrap" id="wapzhishixq_D03_01">公积金</a>贷款；<br></p><p>3、商住房不能落户；<br></p><p>4、商住房不能享受学校、商业、居委会等配套服务；<br></p><p>5、商住房在购买和使用过程中都不能享受住宅的<a data-word="税费" href="javascript:void(0);" class="ct" style="white-space: nowrap" id="wapzhishixq_D03_01">税费</a>减免优惠，交易和持有成本高；<br></p><p>6、商住房水电费、供暖费、物业费等费用标准高于普通住宅，且商住房基本上没有燃气，只能用电磁炉；<br></p><p>7、商住房居住密度相对较大，宜居性较差；<br></p><p>8、由于很难成立业委会，商住房的<a data-word="业主" href="javascript:void(0);" class="ct" style="white-space: nowrap" id="wapzhishixq_D03_01">业主</a>维权也很困难，而且商住不是住宅，所以用作居住时很多权益不受法律保障。</p><p>商住房虽然满足了部分群体的居住需求，但是潜在的问题和风险也特别多。商住房的形成有其历史原因，就目前来说，一二线乃至三四线总库存还是不少的，这也导致了商住房升值空间小、涨幅缓慢。如遇房价下跌，商住房首当其冲，将比普通住宅更快更早下跌，以上是需要购房者审慎考虑的内容。</p></div>
      `,
            from: '老年人协会',
            favorite: 5,
            agree: 4,
            disagree: 3,
        };
        return routes_1.success(article);
    }
};
__decorate([
    routes_1.get('/:id'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ArticleController.prototype, "item", null);
ArticleController = __decorate([
    routes_1.router('/article')
], ArticleController);
exports.ArticleController = ArticleController;
