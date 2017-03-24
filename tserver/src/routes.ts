import * as Router from 'koa-router';
import 'reflect-metadata';
import * as _ from 'lodash';
import * as methods from 'methods';

import { checkSignature } from './utils';
import { Table } from './db';

const ROUTE_METADATA = Symbol('route');
const GUARD_METADATA = Symbol('guard');

const app = {
  'pc': 'c92d1879cde14f18b4a8a17fb225c21c',
};

export interface Controller {
  new (): any;
}

export function router(prefix: string = null) {
  return function(target: Controller) {
    const prop = target.prototype;
    const r = new Router();
    if (prefix) {
      r.prefix(prefix);
    }
    const keys = Object.getOwnPropertyNames(prop).filter((key) => {
      return _.isFunction(prop[key]) && key !== 'constructor';
    }).map((key) => {
      const routes = Reflect.getOwnMetadata(ROUTE_METADATA, prop, key);
      if (routes) {
        const guard = Reflect.getOwnMetadata(GUARD_METADATA, prop, key);
        routes.forEach((value) => {
          const [pattern, methods] = value;
          const fn = createKoaMiddleware(target, key, guard);
          r.register(pattern, methods, fn);
        });
      }
    });
    Reflect.defineMetadata(ROUTE_METADATA, r, target);
  };
};

async function guardMiddleware(ctx, type) {
  if (type === 'login') {
    if (!ctx.session.userId) {
      throw new ResponseError('请先登录', '100004');
    }
  }
  if (type === 'wechat') {
    if (!ctx.session.communityId) {
      throw new ResponseError('社区信息已无效，请重新从公众号进入', '100005');
    }
  }
  if (type === 'api') {
    let appkey = ctx.query.appkey;
    let callid = ctx.query.callid;
    let signature = ctx.query.signature;
    if (!callid) {
      throw new ResponseError('请传入callid');
    }
    if (!signature) {
      throw new ResponseError('请传入signature');
    }
    if (!appkey) {
      throw new ResponseError('请传入appkey');
    }

    let secret = app[appkey];
    if (!secret) {
      throw new ResponseError('无效的appkey');
    }

    if (!checkSignature(secret, callid, signature)) {
      throw new ResponseError('无效的签名');
    }

    try {
      await Table.Apicall.insert({id: callid});
    } catch (ex) {
      if (/ER_DUP_ENTRY/.test(ex.message)) {
        throw new ResponseError('callid已经使用过, 请使用新的callid');
      }
    }
  }
}

function createKoaMiddleware(target: Controller, key: string, guard) {
  const obj = new target();
  const fn = target.prototype[key];
  if (fn.constructor.name === 'AsyncFunction') {
    return async (ctx, next) => {
      await guardMiddleware(ctx, guard);
      const ret = await fn.call(obj, ctx, next);
      if (ret) {
        ctx.body = ret;
      }
    };
  } else {
    return async (ctx, next) => {
      await guardMiddleware(ctx, guard);
      const ret = fn.call(obj, ctx, next);
      if (ret) {
        ctx.body = ret;
      }
    };
  }
}

export function login(target: any, targetKey: string | symbol, targetDescriptor: PropertyDescriptor) {
  Reflect.defineMetadata(GUARD_METADATA, 'login', target, targetKey);
}

export function wechat(target: any, targetKey: string | symbol, targetDescriptor: PropertyDescriptor) {
  Reflect.defineMetadata(GUARD_METADATA, 'wechat', target, targetKey);
}

export function api(target: any, targetKey: string | symbol, targetDescriptor: PropertyDescriptor) {
  Reflect.defineMetadata(GUARD_METADATA, 'api', target, targetKey);
}

export function register(pattern: string | RegExp, methods: string[] = ['all']) {
  return function (target: any, targetKey: string | symbol, targetDescriptor: PropertyDescriptor) {
    let routes = Reflect.getOwnMetadata(ROUTE_METADATA, target, targetKey) || [];
    routes.push([pattern, methods]);
    Reflect.defineMetadata(ROUTE_METADATA, routes, target, targetKey);
  };
}

export function all(pattern: string | RegExp) {
  return register(pattern, methods);
}

export function get(pattern: string | RegExp) {
  return register(pattern, ['get']);
}

export function post(pattern: string | RegExp) {
  return register(pattern, ['post']);
}

export function put(pattern: string | RegExp) {
  return register(pattern, ['put']);
}

export function head(pattern: string | RegExp) {
  return register(pattern, ['head']);
}

export function del(pattern: string | RegExp) {
  return register(pattern, ['delete']);
}

export function options(pattern: string | RegExp) {
  return register(pattern, ['options']);
}

export function trace(pattern: string | RegExp) {
  return register(pattern, ['trace']);
}

export function route(parent: Router, target: Function, url: string | RegExp = '') {
  const r = <Router>Reflect.getOwnMetadata(ROUTE_METADATA, target);
  parent.use(url, r.routes(), r.allowedMethods());
}

export const SUCCESS_CODE = '0';
export const COMMON_ERROR_CODE = '10001';

export class Response {
  code: string;
  value?: any;
  message?: string;

  get success() {
    return this.code === SUCCESS_CODE;
  }
}

export class ResponseError extends Error {
  code: string;
  constructor(message: string, code = COMMON_ERROR_CODE) {
    super(message);
    this.code = code;
  }
}

export function success(value: any = null) {
  const ret =  new Response();
  ret.code = SUCCESS_CODE;
  ret.value = value;
  return ret;
}

export function error(message: string | Error, code: string = COMMON_ERROR_CODE) {
  const ret = new Response();
  ret.code = COMMON_ERROR_CODE;
  if (_.isString(message)) {
    ret.message = message;
  } else if (message['code']) {
    ret.message = message.message;
    ret.code = message['code'];
  } else {
    ret.message = message.toString();
  }

  return ret;
}
