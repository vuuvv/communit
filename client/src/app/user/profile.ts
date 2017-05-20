import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { Location } from '@angular/common';

import { Http } from '../shared';
import { OverlayService, DialogService } from '../../components';

import * as constants from '../constants';

@Component({
  templateUrl: './profile.html',
  styleUrls: ['./profile.less'],
  encapsulation: ViewEncapsulation.None,
})
export class ProfileComponent implements OnInit {
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
      Object.keys(this.profile).forEach((key) => {
        const value = this.profile[key];
        if (value == null) {
          this.profile[key] = '';
        }
      });
    });
  }

  updateSelect(value, key) {
    this.profile[key] = value;
    this.http.json('/user/profile/update/select', {key, value}).subscribe(() => null);
  }

  updateText(field, value, title, meta = '') {
    this.router.navigate(['/user/profile/update/text', {field, value, title, meta}]);
  }
}
