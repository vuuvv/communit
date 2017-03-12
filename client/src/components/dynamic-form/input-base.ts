export class InputBase<T>{
  value: T;
  key: string;
  label: string;
  required: boolean;
  order: number;
  type: string;
  group: string;

  constructor(options: {
      value?: T,
      key?: string,
      label?: string,
      required?: boolean,
      order?: number,
      type?: string,
      group?: string,
    } = {}) {
    this.value = options.value;
    this.key = options.key || '';
    this.label = options.label || '';
    this.required = !!options.required;
    this.order = options.order === undefined ? 1 : options.order;
    this.type = options.type || '';
    this.group = options.group || '';
  }
}
