import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';

import { NgvModule } from '../../components';

import { SharedModule } from '../shared';

import { BankComponent } from './bank';

const routes: Routes = [
  {
    path: 'bank',
    children: [
      {
        path: '',
        pathMatch: 'full',
        component: BankComponent,
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
    BankComponent,
  ]
})
export class BankModule {
}

export * from './bank';
