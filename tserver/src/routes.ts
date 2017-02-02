import * as Router from 'koa-router';
import 'reflect-metadata';
import * as _ from 'lodash';

const ROUTE_METADATA = Symbol('route');

export interface Controller {
  new (): any;
}

export function router(prefix: string = null) {
  return function(target: Controller) {
    const prop = target.prototype;
    const r = new Router();
    const keys = Object.getOwnPropertyNames(prop).filter((key) => {
      return _.isFunction(prop[key]) && key !== 'constructor';
    }).map((key) => {
      if (prefix) {
        r.prefix(prefix);
      }
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
  console.log(target.name, key);
  if (fn.constructor.name === 'AsyncFunction') {
    return async (ctx, next) => {
      ctx.body = await fn.call(obj, ctx, next);
    };
  } else {
    return (ctx, next) => {
      ctx.body = fn.call(obj, ctx, next);
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

export function route(parent: Router, target: Function, url: string | RegExp = '/') {
  const r = <Router>Reflect.getOwnMetadata(ROUTE_METADATA, target);
  parent.use(url, r.routes(), r.allowedMethods());
}
