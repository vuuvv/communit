import 'reflect-metadata';
import * as _ from 'lodash';

const PROPERTY_METADATA = Symbol('property:meta');

export declare const Type: FunctionConstructor;
export interface Type<T> extends Function {
    new (...args: any[]): T;
}

export function property(...names: string[]) {
  return function (target: any, targetKey: string) {
    if (names.indexOf(targetKey) === -1) {
      names.push(targetKey);
    }
    let properties = Reflect.getMetadata(PROPERTY_METADATA, target);
    if (!properties) {
      properties = {};
      properties[targetKey] = targetKey;
    }
    for (let name of names) {
      properties[name] = targetKey;
    }
    Reflect.defineMetadata(PROPERTY_METADATA, properties, target);
  };
}

export function create<T>(type: Type<T>, source: any, ...keys: string[]) {
  if (_.isNil(source)) {
    return source;
  }
  const keyMap = Reflect.getMetadata(PROPERTY_METADATA, type.prototype);
  const target = new type();
  return assign<T>(type, target, source, ...keys);
}

export function assign<T>(type: Type<T>, target: T, source: any, ...keys: string[]) {
  const keyMap = Reflect.getMetadata(PROPERTY_METADATA, type.prototype);

  keys = keys.length === 0 ? Object.keys(keyMap) : keys.filter((value) => {
    return keyMap.hasOwnProperty(value);
  });

  keys.forEach((key) => {
    if (source.hasOwnProperty(key)) {
      const targetKey = keyMap[key];
      target[targetKey] = source[key];
    }
  });
  return target;
}

export interface Object {
  convertTo<T>(type: Type<T>): T;
}

/*
Object.prototype['convertTo'] = function<T>(type: Type<T>) {
  return create(type, this);
}
*/
