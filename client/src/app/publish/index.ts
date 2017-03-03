import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';

import { NgvModule } from '../../components';

import { SharedModule } from '../shared';

import { PublishComponent } from './publish.component';
import { ActionComponent } from './action.component';
import { CatetoryComponent } from './category.component';

const routes: Routes = [
  {
    path: 'publish',
    children: [
      {
        path: 'action',
        component: ActionComponent,
      },
      {
        path: 'category',
        component: CatetoryComponent,
      },
      {
        path: '',
        pathMatch: 'full',
        component: PublishComponent,
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
    ActionComponent,
    CatetoryComponent,
    PublishComponent,
  ]
})
export class PublishModule {
}

