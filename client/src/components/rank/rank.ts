import { Component, Input, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'v-rank',
  templateUrl: './rank.html',
  styleUrls: ['./rank.less'],
  encapsulation: ViewEncapsulation.None,
})
export class RankComponent {
  @Input() points: number = 0;
  @Input() color: string = '#F4EB26';

  get full(): number {
    return parseInt(this.points + '', 10);
  }

  get hasHalf(): boolean {
    return this.points - this.full >= 0.5;
  }

  get empty(): number {
    return this.hasHalf ? 4 - this.full : 5 - this.full;
  }
}
