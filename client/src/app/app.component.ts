import { Component, ViewEncapsulation } from '@angular/core';

import { Observable } from './utils';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.less'],
  encapsulation: ViewEncapsulation.None,
})
export class AppComponent {
  title = 'app works!';
}
