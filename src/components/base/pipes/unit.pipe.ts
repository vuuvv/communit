import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'unit'
})
export class UnitPipe implements PipeTransform {
  transform(value:number, unit:string = 'px') {
    return `${value}${unit}`;
  }
}

@Pipe({
  name: 'px'
})
export class PxPipe implements PipeTransform {
  transform(value:number, unit:string = 'px') {
    return `${value}px`;
  }
}