import { InputBase } from './input-base';

export class InputText extends InputBase<string> {
  type = 'textarea';

  constructor(options: {} = {}) {
    super(options);
  }
}
