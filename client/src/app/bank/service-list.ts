import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, Params } from'@angular/router';

import { Http } from '../shared';
import { OverlayService } from '../../components';

@Component({
  templateUrl: './service-list.html',
  encapsulation: ViewEncapsulation.None,
})
export class ServiceListComponent implements OnInit {
  services: any[] = [];

  constructor(
    private http: Http,
    private route: ActivatedRoute,
    private overlayService: OverlayService,
  ) {}

  ngOnInit() {
    this.overlayService.loading();
    this.route.params.concatMap((params: Params) => {
      return this.http.get('/service/search', Object.assign({}, params));
    }).subscribe((services: any) => {
      this.overlayService.hideToast();
      this.services = services.map((s) => {
        s.data = JSON.parse(s.content);
        return s;
      });
    });
  }
}
