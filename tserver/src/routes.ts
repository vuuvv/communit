import * as Router from 'koa-router';
import 'reflect-metadata';
import * as _ from 'lodash';
import * as methods from 'methods';

const ROUTE_METADATA = Symbol('route');

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
        routes.forEach((value) => {
          const [pattern, methods] = value;
          const fn = createKoaMiddleware(target, key);
          r.register(pattern, methods, fn);
        });
      }
    });
    Reflect.defineMetadata(ROUTE_METADATA, r, target);
  };
};

function createKoaMiddleware(target: Controller, key: string) {
  const obj = new target();
  const fn = target.prototype[key];
  if (fn.constructor.name === 'AsyncFunction') {
    return async (ctx, next) => {
      const ret = await fn.call(obj, ctx, next);
      if (ret) {
        ctx.body = ret;
      }
    };
  } else {
    return (ctx, next) => {
      const ret = fn.call(obj, ctx, next);
      if (ret) {
        ctx.body = ret;
      }
    };
  }
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

export function success(value: any) {
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
  } else {
    ret.message = message.message;
    ret.code = message['code'] || COMMON_ERROR_CODE;
  }

  return ret;
}
