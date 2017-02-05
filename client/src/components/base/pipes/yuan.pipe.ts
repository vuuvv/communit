import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'yuan',
})
export class YuanPipe {
  transform(value: number | string) {
    value = +value || 0;
    return `¥${value.toFixed(2)}`;
  }
}