import { router, get, post, all, success, Response, ResponseError, login } from '../routes';
import { Table, db, raw, first } from '../db';
import { create } from '../utils';

@router('/articles')
export class ArticlesController {
  @get('/home')
  @login
  async home(ctx) {
    let ret = await raw(`
      select * from weixin_cms_article as a
      join weixin_cms_menu as m on m.id=a.column_id
      where m.accountid=? and m.name="社区动态" order by a.create_date desc
    `, [ctx.session.communityId]);
    return success(ret);
  }

  @get('/:id')
  async item(ctx) {
    const id = ctx.params.id;
    let category = await first('select name from weixin_cms_menu where id=?', [id]);
    let ret = await raw('select id, title, summary as `desc`, left(create_date, 10) as date from weixin_cms_article where column_id=? order by create_date desc', [id]);
    return success({
      category: category.name,
      list: ret,
    });
  }
}

@router('/article')
export class ArticleController {
  @get('/:id')
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
    return success(article);
  }
}
