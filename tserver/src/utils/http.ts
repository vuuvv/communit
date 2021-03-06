import * as fs from 'fs';
import { Context } from 'koa';
import * as getRawBody_ from 'raw-body';
import { Config } from '../config';

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

export async function errorPage(ctx, message) {
  let config = await Config.instance();
  await ctx.render('error', { message: message, home: config.clientUrl('/')});
}

export async function successPage(ctx, message, tip = null) {
  let config = await Config.instance();
  await ctx.render('success', { message, tip, home: config.clientUrl('/')});
}

export async function downloadImage(url) {
  let config = await Config.instance();
  let dir = config.site.imageDir;
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir);
  }
}
