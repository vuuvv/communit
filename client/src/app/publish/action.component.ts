import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';

import { Observable } from '../utils';


import { Http } from '../shared';
import { InputBase, InputSelect, InputText, OverlayService } from '../../components';

@Component({
  templateUrl: './action.component.html',
})
export class ActionComponent implements OnInit {
  category: any;
  fields: any;
  type: string;
  showNeedWorker: boolean = false;

  constructor(
    private http: Http,
    private route: ActivatedRoute,
    private overlayService: OverlayService,
    private router: Router,
  ) {}

  ngOnInit() {
    this.overlayService.loading();
    this.route.params.concatMap((params: Params) => {
      this.type = params['type'];
      return Observable.forkJoin(
        this.http.get(`/service/category/${this.type}`),
        this.http.get(`/service/types/${this.type}`),
        this.http.get('/user/workers')
      );
    }).subscribe((values: any) => {
      this.overlayService.hideToast();
      this.category = values[0];
      console.log(this.fields);
      this.fields = JSON.parse(this.category.fields);
      const types = values[1];
      this.showNeedWorker = this.category.needWorker && (!values[2] || !values[2].length);
      this.fields.forEach((value) => {
        if (value.type === 'select') {
          value.options = types.map((t) => {
            return {
              key: t.key,
              value: t.value,
              children: JSON.parse(t.children),
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
      if (this.category.needWorker) {
        this.router.navigate(['/user/worker/0']);
      } else {
        this.router.navigate(['/user/help']);
      }
    });
  }
}
