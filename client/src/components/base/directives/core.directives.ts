import { Type } from '@angular/core';
import { BScrollDirective } from './scroll';
import { RepeatDirective } from './repeat';
import { CooldownDirective } from './cooldown';

export const CORE_DIRECTIVES: Type<any>[] = [
  BScrollDirective,
  RepeatDirective,
  CooldownDirective,
];
