import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';

import { Http } from '../shared';
import { InputBase, InputSelect, InputText, OverlayService } from '../../components';

@Component({
  templateUrl: './action.component.html',
})
export class ActionComponent implements OnInit {
  category: any;
  questions: any;
  type: string;

  constructor(
    private http: Http,
    private route: ActivatedRoute,
    private overlayService: OverlayService,
  ) {}

  ngOnInit() {
    this.overlayService.loading();
    this.route.params.concatMap((params: Params) => {
      this.type = params['type'];
      return this.http.get('/service/category/' + this.type);
    }).subscribe((value: any) => {
      this.category = value;
      this.questions = JSON.parse(value.fields);
      this.overlayService.hideToast();
    });
  }

  submit() {
    this.http.json(`/service/add/${this.type}`).subscribe(() => {
      this.overlayService.toast('操作成功');
    });
  }
}
