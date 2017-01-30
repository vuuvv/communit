import * as Router from 'koa-router';

const router = new Router();

router.all('/', async (ctx) => {
  ctx.body = 'Hello Wechat';
});


export class WechatController {
}

export const wechatRouter = router;
