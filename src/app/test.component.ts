import { Component, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'test',
  template: `<h3>I'm a test</h3>`,
  styles: [`
  h3 { color: blue; }
  `],
  encapsulation: ViewEncapsulation.None,
})
export class TestComponent {
}

@Component({
  selector: 'test-container',
  template: `<test></test>`,
})
export class TestContainerComponent {
}
