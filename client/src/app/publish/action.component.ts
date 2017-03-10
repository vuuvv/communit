import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';

import { Http } from '../shared';

const titles = ['求助', '服务自选', '慈善活动'];

@Component({
  templateUrl: './action.component.html',
})
export class ActionComponent implements OnInit {
  type: number;

  constructor(
    private http: Http,
    private route: ActivatedRoute,
  ) {}

  ngOnInit() {
    this.route.params.forEach((params: Params) => {
      this.type = params['type'];
    });
  }

  get typeName() {
    return titles[this.type];
  }
}
