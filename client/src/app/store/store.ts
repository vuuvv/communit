import { Component, OnInit } from '@angular/core';
import { Http } from '../shared';

@Component({
  templateUrl: './store.html',
  styleUrls: ['./store.less'],
})
export class StoreComponent implements OnInit {
  store: any;

  constructor(
    private http: Http,
  ) {}

  ngOnInit() {
    this.http.get('/store').subscribe((value) => {
      this.store = value;
    });
  }
}

@Component({
  templateUrl: './store-add.html',
  styleUrls: ['./store-add.less'],
})
export class StoreAddComponent implements OnInit {
  store: any = {};
  constructor(
    private http: Http,
  ) {}

  ngOnInit() {
  }
}
