import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'chunk',
})
export class ChunkPipe implements PipeTransform {
  transform(value: any[], length: number) {
    if (!value || !value.length) {
      return [];
    }

    let ret = [];

    for (let i = 0, j = value.length; i < j; i += length) {
      ret.push(value.slice(i, i + length));
    }

    return ret;
  }
}
