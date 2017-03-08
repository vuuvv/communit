import { Context } from 'koa';
import * as getRawBody_ from 'raw-body';

export async function getRawBody(ctx: Context) {
  const request = ctx.request;
  return await getRawBody_(request.req, {
    length: request.length,
    limit: 1024 * 1024,
    encoding: request.charset,
  });
}

export async function getJsonBody(ctx: Context) {
  let body = await getRawBody(ctx);
  return JSON.parse(body);
}

export function getNonceStr() {
    return Math.random().toString(36).substr(2, 15);
}

export function getTimesTamp() {
    return parseInt(new Date().getTime() / 1000 + '', 10);
}
