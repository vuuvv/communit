import { Component, Input, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'v-img-placeholder',
  templateUrl: './img-placeholder.html',
  styleUrls: ['./img-placeholder.less'],
  encapsulation: ViewEncapsulation.None,
})
export class ImgPlaceholderComponent {
  @Input() tip;
  @Input() src;
}
