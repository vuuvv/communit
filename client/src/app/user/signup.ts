import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { NgForm } from '@angular/forms';

import { Http, FormService } from '../shared';
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
    private formService: FormService,
  ) {
  }

  ngOnInit() {
    this.http.get<string>('/signup/verify').subscribe((value) => {
      this.phone = value;
      this.overlayService.hideToast();
    });
  }

  submit(form: NgForm) {
    this.formService.submit(form, {}, `/signup/create`, this.user).subscribe((value) => {
      this.router.navigate(['/user']);
    });
  }
}
