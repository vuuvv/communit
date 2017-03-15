import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';

import { Http } from '../shared';

@Component({
  templateUrl: './summary.html',
})
export class SummaryComponent implements OnInit {
  parent: any;
  children: any[];

  constructor(
    private http: Http,
    private route: ActivatedRoute,
  ) { }

  ngOnInit() {
    this.route.params.concatMap((params: Params) => {
      return this.http.get(`/menu/community/${params['id']}`);
    }).subscribe((value: any) => {
      this.parent = value.parent;
      this.children = value.children;
    });
  }
}
