import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Location } from '@angular/common';

import { Observable } from '../utils';

import { Http, AuthorizeService } from '../shared';
import { validate, FieldRule } from '../utils';
import { DialogService, OverlayService } from '../../components';

const rules: FieldRule[] = [
  { mainTypeId: { strategy: ['required'], error: '请选择大类' } },
  { typeId: { strategy: ['required'], error: '请选择小类' } },
  { points: { strategy: ['required'], error: '请填写悬赏积分' } },
  { points: { strategy: ['isInteger'], error: '积分必须为整数' } },
  { title: { strategy: ['required'], error: '请填写求助内容' } },
];

@Component({
  templateUrl: './help.html',
  styleUrls: ['./question.less'],
  encapsulation: ViewEncapsulation.None,
})
export class HelpComponent implements OnInit {
  types: any[] = [];
  subTypes: any[] = [];
  balance = 0;
  help: any = {
    mainTypeId: '',
    typeId: '',
  };

  constructor(
    private http: Http,
    private location: Location,
    private dialogService: DialogService,
    private overlayService: OverlayService,
    private authorizeService: AuthorizeService,
    private router: Router,
  ) {}

  ngOnInit() {
    Observable.forkJoin(
      this.http.get('/service/types/0'),
      this.http.get('/account/balance'),
    ).subscribe((values: any) => {
      this.types = values[0].map((type) => {
        return {
          key: type.key,
          value: type.value,
          children: JSON.parse(type.children),
        };
      });
      this.balance = values[1];
    });
  }

  back() {
    this.location.back();
  }

  changeTypes() {
    if (this.help.mainTypeId) {
      const type = this.types.find((v) => v.key === this.help.mainTypeId);
      if (type) {
        this.subTypes = type.children || [];
        return;
      }
    }
    this.subTypes = [];
  }

  submit() {
    try {
      validate(this.help, rules);
    } catch (e) {
      this.dialogService.alert(e.message);
      return;
    }

    this.overlayService.loading();
    this.http.json('/service/help/add', this.help).subscribe(() => {
      this.authorizeService.update().subscribe(() => {
        this.overlayService.hideToast();
        this.router.navigate([`/user/service/help/0`]);
      });
    });
  }
}
