import { Component, OnInit } from '@angular/core';
import { Http } from '../shared';

@Component({
  templateUrl: './user.html',
  styleUrls: ['./user.less'],
})
export class UserComponent implements OnInit {
  private user: any = {};

  constructor(private http: Http) {
  }

  ngOnInit() {
    this.http.get('/me').subscribe((value) => {
      this.user = value;
    });
  }
}
