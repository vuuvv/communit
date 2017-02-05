import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'translate3d',
})
export class Translate3dPipe implements PipeTransform {
  transform(value: number | number[]) {
    let x = 0, y = 0, z = 0;
    if (typeof value === 'number') {
      value = [value];
    }
    if (value.length > 0) {
      x = value[0];
    } else if (value.length > 1) {
      y = value[1];
    } else if (value.length > 2) {
      z = value[2];
    }

    return `translate3d(${x}px, ${y}px, ${z}px)`;
  }
}