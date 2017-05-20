import { Component, Input, Output, ViewEncapsulation, EventEmitter } from '@angular/core';

@Component({
  selector: 'v-rank',
  templateUrl: './rank.html',
  styleUrls: ['./rank.less'],
  encapsulation: ViewEncapsulation.None,
})
export class RankComponent {
  @Input() points: number = 0;
  @Input() color: string = '#F4EB26';
  @Output() pointsChange = new EventEmitter();

  get full(): number {
    return parseInt(this.points + '', 10);
  }

  get hasHalf(): boolean {
    return this.points - this.full >= 0.5;
  }

  get empty(): number {
    return this.hasHalf ? 4 - this.full : 5 - this.full;
  }

  rank(i) {
    this.points = i;
    this.pointsChange.emit(i);
  }

  get arr() {
    const ret = [];
    for (let i = 0; i < this.full; i++) {
      ret.push('wujiaoxingman');
    }
    if (this.hasHalf) {
      ret.push('wujiaoxingban');
    }
    for (let i = 0; i < this.empty; i++) {
      ret.push('wujiaoxingkong');
    }

    return ret;
  }
}
