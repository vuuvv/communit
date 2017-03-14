import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'left',
})
export class LeftPipe implements PipeTransform {
  transform(value: string, length: number) {
    if (!value) {
      return 'none';
    }
    return value.substr(0, length);
  }
}
