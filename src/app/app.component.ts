import { Component, ViewEncapsulation } from '@angular/core';
import { Location } from '@angular/common';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  encapsulation: ViewEncapsulation.None,
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  constructor(private location: Location) {
  }

  title = 'app works!';

  close() {
    console.log('close');
  }
}
