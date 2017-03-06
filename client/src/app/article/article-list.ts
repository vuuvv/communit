import { Component, ViewEncapsulation, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';

import { Http } from '../shared';
import { OverlayService } from '../../components';

@Component({
  templateUrl: './article-list.html',
  styleUrls: ['./article-list.less'],
})
export class ArticleListComponent implements OnInit {
  private articles: any = [];
  private category: string;

  constructor(
    private http: Http,
    private route: ActivatedRoute,
    private overlayService: OverlayService,
  ) {
  }

  ngOnInit() {
    this.overlayService.loading();
    this.route.params.forEach((params: Params) => {
      this.http.get(`/articles/${params['id']}`).subscribe((value: any) => {
        this.articles = value.list;
        this.category = value.category;
        this.articles.forEach((v) => {
          v.url = `/article/${v.id}`;
        });

        this.overlayService.hideToast();
      });
    });
  }
}

