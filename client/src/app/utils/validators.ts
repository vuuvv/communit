const strategies = {
  required(value) {
    return !(value === '' || value == null);
  },
  minLength(value, length) {
    return value.length >= length;
  },
  isMoblie(value) {
    return /^1(3|5|7|8|9)[0-9]{9}$/.test(value);
  },
  isEmail(value) {
    return /^\w+([+-.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/.test(value);
  },
  pattern(value, pattern) {
    return pattern.test(value);
  },
  isInteger(value) {
    return !isNaN(value) && parseInt(Number(value) + '', 10) == value && !isNaN(parseInt(value, 10));
  }
};

export class Rule {
  strategy: any[];
  error: string;

  constructor(strategy: any[], error: string) {
    this.strategy = strategy;
    this.error = error;
  }
}

export interface FieldRule {
  [name: string]: Rule;
}

export function validate(target, rules: FieldRule[]) {
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
