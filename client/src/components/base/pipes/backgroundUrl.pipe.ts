import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'backgroundUrl',
})
export class BackgroundUrlPipe implements PipeTransform {
  transform(value: string) {
    if (!value) {
      return 'none';
    }
    return `url('${value}')`;
  }
}