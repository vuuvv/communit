import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';

import { Http } from '../shared';

@Component({
  templateUrl: './question.html'
})
export class QuestionComponent implements OnInit {

  constructor(
    private http: Http
  ) {}

  ngOnInit() {
    this.http.get('/service/types').subscribe(() =>{
    });
  }
}
