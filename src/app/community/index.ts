import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';

import { NgvModule } from '../../components';

import { SharedModule } from '../shared';

import { CommunityComponent } from './community';

const routes: Routes = [
  {
    path: 'community',
    children: [
      {
        path: '',
        pathMatch: 'full',
        component: CommunityComponent,
      },
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
  ]
})
export class CommunityModule {
}

export * from './community';
