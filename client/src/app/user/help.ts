import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';

import { isEmptyArray, Http } from '../shared';

import { OverlayService } from '../../components';

import { Observable } from 'rxjs/Observable';

@Component({
  templateUrl: './help.html',
  styleUrls: ['./help.less']
})
export class HelpComponent implements OnInit {
  services: any[];

  constructor(
    private http: Http,
    private overlayService: OverlayService,
    private route: ActivatedRoute,
  ) {}

  ngOnInit() {
    this.overlayService.loading();
    this.http.get('/service/list/help').subscribe((value: any[]) => {
      this.overlayService.hideToast();
      this.services = value.map((s) => {
        s.data = JSON.parse(s.content);
        return s;
      });
    });
  }
}
