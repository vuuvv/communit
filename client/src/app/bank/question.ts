import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { Router } from '@angular/router';

import { Http, AuthorizeService, sumBy } from '../shared';
import { OverlayService, DialogService } from '../../components';

@Component({
  templateUrl: './question.html',
  styleUrls: ['./question.less'],
  encapsulation: ViewEncapsulation.None,
})
export class QuestionComponent implements OnInit {
  question: any;

  constructor(
    private router: Router,
    private http: Http,
    private route: ActivatedRoute,
    private overlayService: OverlayService,
    private authorizeService: AuthorizeService,
    private dialogService: DialogService,
  ) {}

  ngOnInit() {
  }
}
