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
