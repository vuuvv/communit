import { Component } from '@angular/core';
import { Router } from '@angular/router';

import { Http } from '../shared';

@Component({
  templateUrl: './verify.html',
  styleUrls: ['./verify.less'],
})
export class VerifyComponent {
  verify = {};

  constructor(private http: Http, private router: Router) {
  }

  submit() {
    this.http.json('/signup/verify', this.verify).subscribe((value) => {
      this.router.navigate(['/user/signup']);
    });
  }
}
