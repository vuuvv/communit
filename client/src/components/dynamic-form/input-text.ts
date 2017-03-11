import { InputBase } from './input-base';

export class InputText extends InputBase<string> {
  type = 'text';

  constructor(options: {} = {}) {
    super(options);
  }
}
