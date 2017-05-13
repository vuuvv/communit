import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';

import { NgvModule } from '../../components';
import { SharedModule } from '../shared';

import { GroupListComponent } from './group-list';
import { GroupComponent } from './group';

const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: '',
        pathMatch: 'full',
        component: GroupListComponent,
      },
      {
        path: 'item/:id',
        pathMatch: 'full',
        component: GroupComponent,
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
    GroupListComponent,
    GroupComponent,
  ]
})
export class GroupModule {
}
