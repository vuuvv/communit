import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Location } from '@angular/common';

import { Http, AuthorizeService } from '../shared';
import { validate, FieldRule } from '../utils';
import { DialogService, OverlayService } from '../../components';

const rules: FieldRule[] = [
  { content: { strategy: ['required'], error: '请填写积分' } },
  { content: { strategy: ['isInteger'], error: '积分必须为整数' } },
];

@Component({
  templateUrl: './profile-update-text.html',
  encapsulation: ViewEncapsulation.None,
})
export class ProfileUpdateTextComponent implements OnInit {
  value = '';
  field;
  meta;
  title;

  constructor(
    private http: Http,
    private location: Location,
    private dialogService: DialogService,
    private overlayService: OverlayService,
    private authorizeService: AuthorizeService,
    private router: Router,
    private route: ActivatedRoute,
  ) {}

  ngOnInit() {
    this.route.params.forEach((params: Params) => {
      this.value = params['value'];
      this.field = params['field'];
      this.meta = params['meta'];
      this.title = params['title'];
    });

    setTimeout(() => {
      document.querySelector('textarea').focus();
    });
  }

  back() {
    this.location.back();
  }

  submit() {
    const key = this.field;
    const value = this.value;
    if (!value) {
      this.dialogService.alert('内容不能为空');
      return;
    }

    this.http.json('/user/profile/update/text', {key, value}).subscribe(() => {
      this.location.back();
    });
  }
}
