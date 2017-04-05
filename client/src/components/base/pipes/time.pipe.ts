import { Pipe, PipeTransform } from '@angular/core';

function padding(a, length, padString = '0') {
  let str = a.toString();
  if (str.length > length) {
    return str;
  }
  let prefix = '';
  for (let i = str.length; i < length; i++) {
    prefix += padString;
  }
  return prefix + str;
}

@Pipe({
  name: "time"
})
export class TimePipe implements PipeTransform {
  transform(value: any, format: string = 'day') {
    let date = new Date(value);
    switch (format) {
      case 'day':
        return `${date.getFullYear()}-${padding(date.getMonth() + 1, 2)}-${padding(date.getDate(), 2)}`;
      case 'minite':
        return `${date.getFullYear()}-${padding(date.getMonth() + 1, 2)}-${padding(date.getDate(), 2)} ${padding(date.getHours(), 2)}:${padding(date.getMinutes(), 2)}`;
    }
    return date.toLocaleString();
  }
}
