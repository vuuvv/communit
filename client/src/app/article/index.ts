import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';

import { NgvModule } from '../../components';

import { SharedModule } from '../shared';

import { ArticleComponent } from './article';
import { ArticleListComponent } from './article-list';

const routes: Routes = [
  {
    path: 'article',
    children: [
      {
        path: ':id',
        pathMatch: 'full',
        component: ArticleComponent,
      }
    ],
  },
  {
    path: 'articles',
    children: [
      {
        path: ':id',
        pathMatch: 'full',
        component: ArticleListComponent,
      }
    ],
  },
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes),

    SharedModule,
    NgvModule,
  ],
  declarations: [
    ArticleComponent,
    ArticleListComponent,
  ]
})
export class ArticleModule {
}

export * from './article';
