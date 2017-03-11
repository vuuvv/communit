import { Component, OnInit } from '@angular/core';

import { Http } from '../shared';

@Component({
  templateUrl: './publish.component.html',
  styleUrls: ['./publish.component.less'],
})
export class PublishComponent implements OnInit {
  categories: any;
  constructor(
    private http: Http,
  ) {}

  ngOnInit() {
    this.http.get('/service/categories').subscribe((value) => {
      this.categories = value;
    });
  }
}
