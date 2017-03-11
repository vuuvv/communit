import { InputBase } from './input-base';

export class InputSelect extends InputBase<string> {
  type = 'select';
  options: {key: string, value: string}[] = [];

  constructor(options: {} = {}) {
    super(options);
    this.options = options['options'] || [];
  }
}
