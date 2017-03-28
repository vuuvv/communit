import { Component, ViewEncapsulation, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';

import { Http } from'../shared';
import { OverlayService } from '../../components';

@Component({
  templateUrl: './article.html',
  styleUrls: ['./article.less'],
  encapsulation: ViewEncapsulation.None,
})
export class ArticleComponent implements OnInit {
  article: any;

  constructor(
    private http: Http,
    private route: ActivatedRoute,
    private overlayService: OverlayService,
  ) {
  }

  ngOnInit() {
    this.overlayService.loading();
    this.route.params.forEach((params: Params) => {
      const id = params['id'];
      this.http.get(`/article/${id}`).subscribe((value) => {
        this.article = value;
        this.overlayService.hideToast();
      });
    });
  }
}
