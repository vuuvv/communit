import { Type } from '@angular/core';
import { BackgroundUrlPipe } from './backgroundUrl.pipe';
import { Translate3dPipe } from './translate3d.pipe';
import { UnSafePipe } from './unsafe.pipe';
import { RepeatPipe } from './repeat.pipe';
import { UnitPipe, PxPipe } from './unit.pipe';
import { YuanPipe } from './yuan.pipe';
import { GenderPipe } from './gender.pipe';
import { SplitePipe } from './split.pipe';
import { FirstPipe } from './first.pipe';
import { LimitPipe } from './limit.pipe';
import { LeftPipe } from './left.pipe';
import { ChunkPipe } from './chunk.pipe';

export const CORE_PIPES: Type<any>[] = [
  BackgroundUrlPipe,
  Translate3dPipe,
  UnSafePipe,
  RepeatPipe,
  UnitPipe,
  PxPipe,
  YuanPipe,
  GenderPipe,
  SplitePipe,
  FirstPipe,
  LimitPipe,
  LeftPipe,
  ChunkPipe,
];
