import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'slice'
})
export class LimitPipe implements PipeTransform {
  transform(value: any[], start: number, length) {
    if (!value) {
      return [];
    }
    return value.slice(start, start + length);
  }
}
