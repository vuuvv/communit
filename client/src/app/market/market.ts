import { Component, ViewEncapsulation } from '@angular/core';

@Component({
  templateUrl: './market.html',
  styleUrls: ['./market.less'],
  encapsulation: ViewEncapsulation.None,
})
export class MarketComponent {
  private hotProducts = [
    {
      "UserCode": "A0003U",
      "Location": "1",
      "HMBSpuCode": "HJN^Y00002YS",
      "Title": "纽曼（Newmine）I603 苹果数据线 iphone6s数据线充电线 编织线 适用于苹果6/6s plus 编织线 白色亮点：TPE线防缠绕，手感软 线",
      "FirstImageUrl": "http://product.huijinet.com/uploadFiles/product/platform/000000/HJN^Y00002YS/vshop670593-1458982301627-6211533.jpg",
      "HMBAvailabilityPrice": "2.50",
      "sellNum": "1"
    },
    {
      "UserCode": "A00DHT",
      "Location": "2",
      "HMBSpuCode": "HJN^Y00008S1",
      "Title": "【中秋专享】【厦门专享】台湾进口凤梨酥168g*3盒装29.9元包邮",
      "FirstImageUrl": "http://product.huijinet.com/uploadFiles/product/platform/000000/HJN^Y00008S1/vshop2341188-1472628004576-8531431.jpg",
      "HMBAvailabilityPrice": "27.00",
      "sellNum": "2"
    },
    {
      "UserCode": "A0102U",
      "Location": "3",
      "HMBSpuCode": "HJN^Y0000AFB",
      "Title": "【福建省内配送】明记在心农妃土鸡蛋来自清流大丰山景区的土鸡蛋 更营养 更健康 （保质期30天放冰箱保鲜)",
      "FirstImageUrl": "http://product.huijinet.com/uploadFiles/product/personal/A0102U/VDP^Y0000AFB/vshop2289954-147859313220-677913.jpg",
      "HMBAvailabilityPrice": "49.00",
      "sellNum": "1"
    },
    {
      "UserCode": "A00YWC",
      "Location": "4",
      "HMBSpuCode": "HJN^Y0000B6D",
      "Title": "1228g雕牌清新柠檬洗洁精 ",
      "FirstImageUrl": "http://product.huijinet.com/uploadFiles/product/personal/A00YWC/VDP^Y0000B6D/vshop1023939064-148041949661-5099710.jpg",
      "HMBAvailabilityPrice": "9.90",
      "sellNum": "4"
    },
    {
      "UserCode": "A00DHT",
      "Location": "5",
      "HMBSpuCode": "HJN^Y0000A6J",
      "Title": "【新品限量抢购】纯度抽纸，新品特价38元/箱（20包/箱），全国包邮，更有买3箱送2条手帕纸，仅限前100单",
      "FirstImageUrl": "http://product.huijinet.com/uploadFiles/product/platform/000000/HJN^Y0000A6J/vshop2341188-1476347976863-166280.jpg",
      "HMBAvailabilityPrice": "33.50",
      "sellNum": "3"
    },
    {
      "UserCode": "A00YWC",
      "Location": "6",
      "HMBSpuCode": "HJN^Y0000B6C",
      "Title": "1000雕牌全渍净洗衣液（健康除菌）（带出液口） ",
      "FirstImageUrl": "http://product.huijinet.com/uploadFiles/product/personal/A00YWC/VDP^Y0000B6C/vshop1023939064-1480379681213-1809027.jpg",
      "HMBAvailabilityPrice": "9.90",
      "sellNum": "3"
    },
    {
      "UserCode": "A00YWC",
      "Location": "7",
      "HMBSpuCode": "HJN^Y0000BC7",
      "Title": "纳爱斯香皂125g*2块 健康益肤洁白清香美白香皂",
      "FirstImageUrl": "http://product.huijinet.com/uploadFiles/product/platform/000000/HJN^Y0000BC7/vshop1023939064-148240606492-6055928.jpg",
      "HMBAvailabilityPrice": "11.00",
      "sellNum": "3"
    },
    {
      "UserCode": "A00YWC",
      "Location": "8",
      "HMBSpuCode": "HJN^Y0000BC8",
      "Title": "雕牌高效洗洁精500g*2 健康去菌酒店饭店餐具水果蔬菜通用洗洁精",
      "FirstImageUrl": "http://product.huijinet.com/uploadFiles/product/platform/000000/HJN^Y0000BC8/vshop1023939064-14824060003-3893986.jpg",
      "HMBAvailabilityPrice": "11.00",
      "sellNum": "28"
    },
    {
      "UserCode": "A0106T",
      "Location": "9",
      "HMBSpuCode": "HJN^Y0000A8G",
      "Title": "5-6斤装 正宗琯溪红心蜜柚 福建平和特色水果 2粒装",
      "FirstImageUrl": "http://product.huijinet.com/uploadFiles/product/platform/000000/HJN^Y0000A8G/vshop731961944-1477296702437-1713311.jpg",
      "HMBAvailabilityPrice": "30.00",
      "sellNum": "6"
    },
    {
      "UserCode": "A00YWC",
      "Location": "10",
      "HMBSpuCode": "HJN^Y0000BC6",
      "Title": "超能洗衣皂226g*2块 柠檬草透明皂包邮促销衣物去污皂",
      "FirstImageUrl": "http://product.huijinet.com/uploadFiles/product/platform/000000/HJN^Y0000BC6/vshop1023939064-1482406159946-6676038.jpg",
      "HMBAvailabilityPrice": "11.00",
      "sellNum": "2"
    }
  ];
}
