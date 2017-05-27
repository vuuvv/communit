"use strict";
function isEmpty(value) {
    return value === '' || value == null;
}
// 验证方法中只有required验证是否为空， 其他的如果为空则返回真
const strategies = {
    required(value) {
        return !isEmpty(value);
    },
    minLength(value, length) {
        return isEmpty(value) || value.length >= length;
    },
    isMoblie(value) {
        return isEmpty(value) || /^1(3|5|7|8|9)[0-9]{9}$/.test(value);
    },
    isEmail(value) {
        return isEmpty(value) || /^\w+([+-.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/.test(value);
    },
    pattern(value, pattern) {
        return isEmpty(value) || pattern.test(value);
    },
    isInteger(value) {
        return isEmpty(value) || !isNaN(value) && parseInt(Number(value) + '', 10) == value && !isNaN(parseInt(value, 10));
    }
};
class Rule {
    constructor(strategy, error) {
        this.strategy = strategy;
        this.error = error;
    }
}
exports.Rule = Rule;
function validate(target, rules) {
    for (const rule of rules) {
        const key = Object.keys(rule)[0];
        const value = target[key];
        const r = rule[key];
        const strategy = r.strategy.concat([]);
        const strategyName = strategy.shift();
        strategy.unshift(value);
        const success = strategies[strategyName].apply(null, strategy);
        if (!success) {
            throw new Error(r.error);
        }
    }
}
exports.validate = validate;
