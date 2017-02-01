import { router, get } from '../routes';

@router('wechat')
export class WechatController {
  @get('/test')
  @get('/test1')
  test(ctx) {
    return 'wechat test';
  }
}

@router('test')
export class TestController {
  @get('/test')
  async test(ctx) {
    return 'test test';
  }
}

