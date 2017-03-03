import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';

import { NgvModule } from '../../components';

import { SharedModule } from '../shared';

import { BankComponent } from './bank';
import { ServiceComponent } from './service';
import { ActivityComponent } from './activity';
import { WorkerComponent } from './worker';

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
      {
        path: 'worker/:type',
        pathMatch: 'full',
        component: WorkerComponent,
      },
      {
        path: 'activity/:id',
        component: ActivityComponent,
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
    BankComponent,
    ServiceComponent,
    ActivityComponent,
    WorkerComponent,
  ]
})
export class BankModule {
}

export * from './bank';
export * from './service';
