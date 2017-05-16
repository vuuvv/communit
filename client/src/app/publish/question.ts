import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Location } from '@angular/common';

import { Http } from '../shared';

@Component({
  templateUrl: './question.html',
  styleUrls: ['question.less'],
  encapsulation: ViewEncapsulation.None,
})
export class QuestionComponent implements OnInit {
  types: any[] = [];
  subTypes: any[] = [];
  question: any = {
    mainTypeId: '',
    typeId: '',
  };

  constructor(
    private http: Http,
    private location: Location,
  ) {}

  ngOnInit() {
    this.http.get('/service/types/1').subscribe((v: any) =>{
      this.types = v.map((type) => {
        return {
          key: type.key,
          value: type.value,
          children: JSON.parse(type.children),
        };
      });
    });
  }

  back() {
    this.location.back();
  }

  changeTypes() {
    console.log(this.question.mainTypeId);
    if (this.question.mainTypeId) {
      const type = this.types.find((v) => v.key === this.question.mainTypeId);
      if (type) {
        this.subTypes = type.children || [];
        return;
      }
    }
    this.subTypes = [];
  }
}
