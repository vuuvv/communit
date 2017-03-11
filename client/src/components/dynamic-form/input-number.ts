import { InputBase } from './input-base';

export class InputText extends InputBase<string> {
  type = 'number';
  step = '';

  constructor(options: {} = {}) {
    super(options);
    this.step = options['step'] || '1';
  }
}
