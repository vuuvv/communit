import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Location } from '@angular/common';

import { Http, AuthorizeService } from '../shared';
import { validate, FieldRule } from '../utils';
import { DialogService, OverlayService } from '../../components';

const rules: FieldRule[] = [
  { points: { strategy: ['required'], error: '请填写悬赏积分' } },
  { points: { strategy: ['isInteger'], error: '积分必须为整数' } },
];

@Component({
  templateUrl: './confirm-answer.html',
  encapsulation: ViewEncapsulation.None,
})
export class ConfirmAnswerComponent implements OnInit {
  answer;
  points;

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
    this.overlayService.loading();
    this.route.params.concatMap((params: Params) => {
      return this.http.get(`/service/answer/${params['id']}`)
    }).subscribe((v: any) => {
      this.overlayService.hideToast();
      this.answer = v;
      this.points = this.answer.question.points - this.answer.question.payedPoints;
    });
  }

  back() {
    this.location.back();
  }

  submit() {
    const data = { points: this.points };
    try {
      validate(data, rules);
    } catch (e) {
      this.dialogService.alert(e.message);
      return;
    }

    this.http.json(`/service/answer/${this.answer.id}/pay`, data).subscribe(() => {
      this.location.back();
    });
  }
}
