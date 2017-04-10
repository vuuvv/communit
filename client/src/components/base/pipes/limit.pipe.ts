import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'slice'
})
export class LimitPipe implements PipeTransform {
  transform(value: any[], start: number, length) {
    if (!value || !value.length) {
      return [];
    }
    if (length < 0) {
      length = value.length + length;
    }
    if (length < 0) {
      return [];
    }
    return value.slice(start, start + length);
  }
}
