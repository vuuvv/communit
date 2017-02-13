import 'reflect-metadata';
export declare const Type: FunctionConstructor;
export interface Type<T> extends Function {
    new (...args: any[]): T;
}
export declare function property(...names: string[]): (target: any, targetKey: string) => void;
export declare function create<T>(type: Type<T>, source: any, ...keys: string[]): T;
export declare function assign<T>(type: Type<T>, target: T, source: any, ...keys: string[]): T;
export interface Object {
    convertTo<T>(type: Type<T>): T;
}
