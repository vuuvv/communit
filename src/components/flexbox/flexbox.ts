import { Component, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'v-flexbox',
  templateUrl: './flexbox.html',
  styleUrls: ['./flexbox.less'],
  encapsulation: ViewEncapsulation.None,
})
export class FlexboxComponent {
}

@Component({
  selector: 'v-flexbox-item',
  templateUrl: './flexbox-item.html',
  styleUrls: ['./flexbox-item.less'],
  encapsulation: ViewEncapsulation.None,
})
export class FlexboxItemComponent{
}
