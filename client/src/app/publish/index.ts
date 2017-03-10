import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';

import { NgvModule } from '../../components';

import { SharedModule } from '../shared';

import { PublishComponent } from './publish.component';
import { ActionComponent } from './action.component';

const routes: Routes = [
  {
    path: 'publish',
    children: [
      {
        path: 'action/:type',
        component: ActionComponent,
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
    PublishComponent,
  ]
})
export class PublishModule {
}

