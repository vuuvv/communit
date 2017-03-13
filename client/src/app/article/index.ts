import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';

import { NgvModule } from '../../components';

import { SharedModule } from '../shared';

import { ArticleComponent } from './article';
import { ArticleListComponent } from './article-list';
import { EmptyComponent } from './empty';

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
  {
    path: 'empty',
    children: [
      {
        path: '',
        pathMatch: 'full',
        component: EmptyComponent,
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
    EmptyComponent,
  ]
})
export class ArticleModule {
}

export * from './article';
