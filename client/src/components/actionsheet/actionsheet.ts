import { Component, Input, Output, EventEmitter, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'v-actionsheet',
  templateUrl: './actionsheet.html',
  styleUrls: ['./actionsheet.less'],
  encapsulation: ViewEncapsulation.None,
})
export class ActionSheetComponent {
  @Input() show = false;
  @Output() showChange = new EventEmitter();

  close() {
    this.show = false;
    this.showChange.emit(false);
  }
}

@Component({
  selector: 'v-actionsheet-item',
  templateUrl: './actionsheet-item.html',
  host: {
    '[class.weui-actionsheet__cell]': 'true',
  }
})
export class ActionSheetItemComponent {
}
