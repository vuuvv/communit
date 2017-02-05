import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';

import { NgvModule } from '../../components';

import { SharedModule } from '../shared';

import { BankComponent } from './bank';
import { ServiceComponent } from './service';

const routes: Routes = [
  {
    path: 'bank',
    children: [
      {
        path: '',
        pathMatch: 'full',
        component: BankComponent,
      },
      {
        path: 'service/:type',
        pathMatch: 'full',
        component: ServiceComponent,
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
    ServiceComponent,
  ]
})
export class BankModule {
}

export * from './bank';
export * from './service';
