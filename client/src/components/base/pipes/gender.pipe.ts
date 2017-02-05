import { PipeTransform, Pipe } from '@angular/core';

@Pipe ({name: 'gender'})
export class GenderPipe implements PipeTransform {
  transform(value: string) {
    switch (value) {
      case 'male':
        return '男';
      case 'female':
        return '女';
      default:
        return value;
    }
  }
}