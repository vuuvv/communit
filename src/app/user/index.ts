import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';

import { NgvModule } from '../../components';

import { SharedModule } from '../shared';

import { UserComponent } from './user';
import { VerifyComponent } from './verify';

const routes: Routes = [
  {
    path: 'user',
    children: [
      {
        path: '',
        pathMatch: 'full',
        component: UserComponent,
      },
      {
        path: 'verify',
        pathMatch: 'full',
        component: VerifyComponent,
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
    UserComponent,
    VerifyComponent,
  ]
})
export class UserModule {
}

export * from './user';
