import { Component } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';

import { isEmptyArray, Http } from '../shared';

@Component({
  templateUrl: './worker-add.html',
})
export class WorkerAddComponent {
  user: any = {};

  constructor(
    private http: Http,
    private route: ActivatedRoute,
  ) {}
  submit() {
    console.log(this.user);
  }
}
