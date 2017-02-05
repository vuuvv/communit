import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { Http } from '../shared';

@Component({
  templateUrl: './signup.html',
  styleUrls: ['./signup.less'],
})
export class SignupComponent implements OnInit {
  private user = {}
  private phone:string = '';

  constructor(private http: Http, private router: Router) {
  }

  ngOnInit() {
    this.http.get<string>('/verify').subscribe((value) => {
      this.phone = value;
    })
  }

  submit() {
    this.http.json('/signup', this.user).subscribe((value) => {
      this.router.navigate(['/user']);
    })
  }
}
