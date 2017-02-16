"use strict";
const Router = require("koa-router");
require("reflect-metadata");
const _ = require("lodash");
const methods = require("methods");
const ROUTE_METADATA = Symbol('route');
const GUARD_METADATA = Symbol('guard');
function router(prefix = null) {
    return function (target) {
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
}
exports.router = router;
;
async function guardMiddleware(ctx, type) {
    console.log(type);
    if (type === 'login') {
        if (!ctx.session.userId) {
            throw new ResponseError('请先登录', '100004');
        }
    }
}
function createKoaMiddleware(target, key, guard) {
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
    }
    else {
        return async (ctx, next) => {
            await guardMiddleware(ctx, guard);
            const ret = fn.call(obj, ctx, next);
            if (ret) {
                ctx.body = ret;
            }
        };
    }
}
function login(target, targetKey, targetDescriptor) {
    Reflect.defineMetadata(GUARD_METADATA, 'login', target, targetKey);
}
exports.login = login;
function register(pattern, methods = ['all']) {
    return function (target, targetKey, targetDescriptor) {
        let routes = Reflect.getOwnMetadata(ROUTE_METADATA, target, targetKey) || [];
        routes.push([pattern, methods]);
        Reflect.defineMetadata(ROUTE_METADATA, routes, target, targetKey);
    };
}
exports.register = register;
function all(pattern) {
    return register(pattern, methods);
}
exports.all = all;
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
function route(parent, target, url = '') {
    const r = Reflect.getOwnMetadata(ROUTE_METADATA, target);
    parent.use(url, r.routes(), r.allowedMethods());
}
exports.route = route;
exports.SUCCESS_CODE = '0';
exports.COMMON_ERROR_CODE = '10001';
class Response {
    get success() {
        return this.code === exports.SUCCESS_CODE;
    }
}
exports.Response = Response;
class ResponseError extends Error {
    constructor(message, code = exports.COMMON_ERROR_CODE) {
        super(message);
        this.code = code;
    }
}
exports.ResponseError = ResponseError;
function success(value = null) {
    const ret = new Response();
    ret.code = exports.SUCCESS_CODE;
    ret.value = value;
    return ret;
}
exports.success = success;
function error(message, code = exports.COMMON_ERROR_CODE) {
    const ret = new Response();
    ret.code = exports.COMMON_ERROR_CODE;
    if (_.isString(message)) {
        ret.message = message;
    }
    else {
        ret.message = message.message;
        ret.code = message['code'] || exports.COMMON_ERROR_CODE;
    }
    return ret;
}
exports.error = error;
