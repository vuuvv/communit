"use strict";
const Router = require("koa-router");
require("reflect-metadata");
const _ = require("lodash");
const methods = require("methods");
const utils_1 = require("./utils");
const db_1 = require("./db");
const ROUTE_METADATA = Symbol('route');
const GUARD_METADATA = Symbol('guard');
const app = {
    'pc': 'c92d1879cde14f18b4a8a17fb225c21c',
};
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
        if (!utils_1.checkSignature(secret, callid, signature)) {
            throw new ResponseError('无效的签名');
        }
        try {
            await db_1.Table.Apicall.insert({ id: callid });
        }
        catch (ex) {
            if (/ER_DUP_ENTRY/.test(ex.message)) {
                throw new ResponseError('callid已经使用过, 请使用新的callid');
            }
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
function wechat(target, targetKey, targetDescriptor) {
    Reflect.defineMetadata(GUARD_METADATA, 'wechat', target, targetKey);
}
exports.wechat = wechat;
function api(target, targetKey, targetDescriptor) {
    Reflect.defineMetadata(GUARD_METADATA, 'api', target, targetKey);
}
exports.api = api;
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
    else if (message['code']) {
        ret.message = message.message;
        ret.code = message['code'];
    }
    else {
        ret.message = message.toString();
    }
    return ret;
}
exports.error = error;
