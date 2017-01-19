import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';

import { NgvModule } from '../../components';

import { SharedModule } from '../shared';

import { CommunityComponent } from './community';
import { SummaryComponent } from './summary';

const routes: Routes = [
  {
    path: 'community',
    children: [
      {
        path: '',
        pathMatch: 'full',
        component: CommunityComponent,
      },
      {
        path: 'summary',
        component: SummaryComponent,
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
    CommunityComponent,
    SummaryComponent,
  ]
})
export class CommunityModule {
}

export * from './community';
