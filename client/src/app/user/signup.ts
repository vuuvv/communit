import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';

import { Http } from '../shared';
import { OverlayService } from '../../components';

@Component({
  templateUrl: './signup.html',
  styleUrls: ['./signup.less'],
})
export class SignupComponent implements OnInit {
  private user = {};
  private phone: string = '';
  private communityId: string;

  constructor(
    private http: Http,
    private router: Router,
    private route: ActivatedRoute,
    private overlayService: OverlayService,
  ) {
  }

  ngOnInit() {
    this.http.get<string>('/signup/verify').subscribe((value) => {
      this.phone = value;
      this.overlayService.hideToast();
    });
  }

  submit() {
    this.http.json(`/signup/create`, this.user).subscribe((value) => {
      this.router.navigate(['/user']);
    });
  }
}
