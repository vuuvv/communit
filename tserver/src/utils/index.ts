export * from './property';
export * from './http';
export * from './uuid';
export * from './validators';

import * as crypto from 'crypto';

export function signature(secret: string, plan: string) {
    let h = crypto.createHmac('sha1', secret);
    h.update(plan);
    return h.digest('hex').toUpperCase();
}

export function checkSignature(secret: string, plan: string, target: string) {
  if (!target) {
    return false;
  }
  return signature(secret, plan) === target.toUpperCase();
}

export function isInteger(value) {
  return !isNaN(value) && parseInt(Number(value) + '', 10) == value && !isNaN(parseInt(value, 10));
}

export function validPoints(points) {
  if (points == null) {
    throw new Error('积分必须为正整数');
  }

  if (typeof points !== 'string' && typeof points !== 'number') {
    throw new Error('积分必须为正整数');
  }

  if (!/^[+]?\d+$/.test(points.toString())) {
    throw new Error('积分必须为正整数');
  }

  let ret = +points;
  if (ret <= 0) {
    throw new Error('积分必须大于1');
  }

  return ret;
}
