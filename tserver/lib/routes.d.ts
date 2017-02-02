import * as Router from 'koa-router';
import 'reflect-metadata';
export interface Controller {
    new (): any;
}
export declare function router(prefix?: string): (target: Controller) => void;
export declare function register(pattern: string | RegExp, methods?: string[]): (target: any, targetKey: string | symbol, targetDescriptor: PropertyDescriptor) => void;
export declare function get(pattern: string | RegExp): (target: any, targetKey: string | symbol, targetDescriptor: PropertyDescriptor) => void;
export declare function post(pattern: string | RegExp): (target: any, targetKey: string | symbol, targetDescriptor: PropertyDescriptor) => void;
export declare function put(pattern: string | RegExp): (target: any, targetKey: string | symbol, targetDescriptor: PropertyDescriptor) => void;
export declare function head(pattern: string | RegExp): (target: any, targetKey: string | symbol, targetDescriptor: PropertyDescriptor) => void;
export declare function del(pattern: string | RegExp): (target: any, targetKey: string | symbol, targetDescriptor: PropertyDescriptor) => void;
export declare function options(pattern: string | RegExp): (target: any, targetKey: string | symbol, targetDescriptor: PropertyDescriptor) => void;
export declare function trace(pattern: string | RegExp): (target: any, targetKey: string | symbol, targetDescriptor: PropertyDescriptor) => void;
export declare function route(parent: Router, target: Function, url?: string | RegExp): void;
