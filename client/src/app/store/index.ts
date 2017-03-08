import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { NgvModule } from '../../components';

import { SharedModule } from '../shared';

import { StoreComponent, StoreAddComponent } from './store';

const routes: Routes = [
  {
    path: 'store',
    children: [
      {
        path: '',
        pathMatch: 'full',
        component: StoreComponent,
      },
      {
        path: 'add',
        pathMatch: 'full',
        component: StoreAddComponent,
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
    StoreComponent,
    StoreAddComponent,
  ]
})
export class StoreModule {
}

export * from './store';
