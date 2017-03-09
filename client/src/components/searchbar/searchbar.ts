import {
  Component, ViewEncapsulation, Input, Output, HostBinding, EventEmitter, Renderer, ElementRef, ViewChild
} from '@angular/core';

@Component({
  selector: 'v-searchbar',
  templateUrl: './searchbar.html',
  styleUrls: ['./searchbar.less'],
})
export class SearchbarComponent {
  keyword: string;
  focused: boolean = false;

  @Output() submit = new EventEmitter();
  @ViewChild('input') input: ElementRef;

  constructor(private renderer: Renderer) {
  }

  clear() {
    this.keyword = '';
  }

  cancel() {
    this.clear();
    this.focused = false;
  }

  click() {
    this.focused = true;
    this.renderer.invokeElementMethod(this.input.nativeElement, 'focus', []);
  }

  search() {
    this.submit.emit(this.keyword);
  }
}
