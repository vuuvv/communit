import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: "first"
})
export class FirstPipe implements PipeTransform {
  transform(value: any[]) {
    if (!value) {
      return null;
    }
    if (!value.length) {
      return null;
    }
    return value[0];
  }
}