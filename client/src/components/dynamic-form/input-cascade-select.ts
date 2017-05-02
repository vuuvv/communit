import { InputBase } from './input-base';

export class InputCascadeSelect extends InputBase<string> {
  type = 'cascade-select';
  options: {key: string, value: string}[] = [];

  constructor(options: {} = {}) {
    super(options);
    this.options = options['options'] || [];
  }
}
