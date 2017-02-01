"use strict";
const Router = require("koa-router");
require("reflect-metadata");
const _ = require("lodash");
const ROUTE_METADATA = Symbol('route');
function router(prefix) {
    return function (target) {
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
                    console.log(prop[key].constructor);
                    const fn = createKoaMiddleware(target, key);
                    r.register(pattern, methods, fn);
                });
            }
        });
        Reflect.defineMetadata(ROUTE_METADATA, r, target);
    };
}
exports.router = router;
;
function createKoaMiddleware(target, key) {
    const obj = new target();
    const fn = target.prototype[key];
    if (fn.constructor.name === 'AsyncFunction') {
        return async (ctx, next) => {
            ctx.body = await fn.call(obj, ctx, next);
        };
    }
    else {
        return (ctx, next) => {
            ctx.body = fn.call(obj, ctx, next);
        };
    }
}
function register(pattern, methods = ['all']) {
    return function (target, targetKey, targetDescriptor) {
        let routes = Reflect.getOwnMetadata(ROUTE_METADATA, target, targetKey) || [];
        routes.push([pattern, methods]);
        Reflect.defineMetadata(ROUTE_METADATA, routes, target, targetKey);
    };
}
exports.register = register;
function get(pattern) {
    return register(pattern, ['get']);
}
exports.get = get;
function post(pattern) {
    return register(pattern, ['post']);
}
exports.post = post;
function put(pattern) {
    return register(pattern, ['put']);
}
exports.put = put;
function head(pattern) {
    return register(pattern, ['head']);
}
exports.head = head;
function del(pattern) {
    return register(pattern, ['delete']);
}
exports.del = del;
function options(pattern) {
    return register(pattern, ['options']);
}
exports.options = options;
function trace(pattern) {
    return register(pattern, ['trace']);
}
exports.trace = trace;
function route(parent, target, url = '/') {
    const r = Reflect.getOwnMetadata(ROUTE_METADATA, target);
    parent.use(url, r.routes(), r.allowedMethods());
}
exports.route = route;
