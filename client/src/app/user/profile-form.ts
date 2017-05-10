import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { Location } from '@angular/common';

import { Http } from '../shared';
import { OverlayService, DialogService } from '../../components';

import * as constants from '../constants';

@Component({
  templateUrl: './profile-form.html',
  styleUrls: ['./profile-form.less'],
  encapsulation: ViewEncapsulation.None,
})
export class ProfileFormComponent implements OnInit {
  profile: any = {};
  constants = constants;

  constructor(
    private http: Http,
    private router: Router,
    private route: ActivatedRoute,
    private overlayService: OverlayService,
    private dialogService: DialogService,
    private location: Location,
  ) {}

  ngOnInit() {
    this.http.get('/user/profile').subscribe((v: any) => {
      this.profile = v;
    });
  }

  submit() {
  }
}