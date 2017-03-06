import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';

import { NgvModule } from '../../components';

import { SharedModule } from '../shared';

import { BankComponent } from './bank';
import { ServiceComponent } from './service';
import { ActivityComponent } from './activity';
import { WorkerComponent } from './worker';
import { AgencyComponent } from './agency';
import { OrganizationComponent } from './organization';
import { ProfessionComponent } from './profession';
import { ProfessionListComponent } from './profession-list';

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
        path: 'worker',
        pathMatch: 'full',
        component: WorkerComponent,
      },
      {
        path: 'agency',
        pathMatch: 'full',
        component: AgencyComponent,
      },
      {
        path: 'organization',
        pathMatch: 'full',
        component: OrganizationComponent,
      },
      {
        path: 'profession',
        pathMatch: 'full',
        component: ProfessionComponent,
      },
      {
        path: 'profession-list',
        pathMatch: 'full',
        component: ProfessionListComponent,
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
    AgencyComponent,
    OrganizationComponent,
    ProfessionComponent,
    ProfessionListComponent,
  ]
})
export class BankModule {
}

export * from './bank';
export * from './service';
export * from './agency';
