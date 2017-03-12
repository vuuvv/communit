import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/forkJoin';

import { Http } from '../shared';
import { InputBase, InputSelect, InputText, OverlayService } from '../../components';

@Component({
  templateUrl: './action.component.html',
})
export class ActionComponent implements OnInit {
  category: any;
  fields: any;
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
      return Observable.forkJoin(
        this.http.get(`/service/category/${this.type}`),
        this.http.get(`/service/types/${this.type}`)
      );
    }).subscribe((values: any) => {
      this.overlayService.hideToast();
      this.category = values[0];
      this.fields = JSON.parse(this.category.fields);
      let types = values[1];
      this.fields.forEach((value) => {
        if (value.type === 'select') {
          value.options = types.map((t) => {
            return {
              key: t.id,
              value: t.name,
            };
          });
        }
      });
    });
  }

  submit(data) {
    this.overlayService.loading();
    this.http.json(`/service/add/${this.type}`, data).subscribe(() => {
      this.overlayService.toast('操作成功');
    });
  }
}
