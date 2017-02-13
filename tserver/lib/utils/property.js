"use strict";
require("reflect-metadata");
const PROPERTY_METADATA = Symbol('property:meta');
function property(...names) {
    return function (target, targetKey) {
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
exports.property = property;
function create(type, source, ...keys) {
    const keyMap = Reflect.getMetadata(PROPERTY_METADATA, type.prototype);
    const target = new type();
    return assign(type, target, source, ...keys);
}
exports.create = create;
function assign(type, target, source, ...keys) {
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
exports.assign = assign;
/*
Object.prototype['convertTo'] = function<T>(type: Type<T>) {
  return create(type, this);
}
*/
