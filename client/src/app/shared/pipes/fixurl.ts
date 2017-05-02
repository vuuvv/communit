import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'fixurl',
})
export class FixurlPipe implements PipeTransform {
  transform(value: string) {
    if (!value) {
      return null;
    }
    let prefix = window['BASE_URL'];
    if (/^((https?:\/\/)|(\/\/))/.test(value)) {
      return value;
    }
    return `http://www.crowdnear.com/pc/${value}`;
  }
}
