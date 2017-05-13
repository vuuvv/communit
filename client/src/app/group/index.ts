import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

import { NgvModule } from '../../components';
import { SharedModule } from '../shared';

import { GroupListComponent } from './group-list';
import { GroupComponent } from './group';
import { ThreadAddComponent } from './thread-add';

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
      {
        path: ':id/thread/add',
        pathMatch: 'full',
        component: ThreadAddComponent,
      },
    ],
  },
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    RouterModule.forChild(routes),
    SharedModule,
    NgvModule,
  ],
  declarations: [
    GroupListComponent,
    GroupComponent,
    ThreadAddComponent,
  ]
})
export class GroupModule {
}
