import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

import { NgvModule } from '../../components';

import { SharedModule, AuthorizeGuard } from '../shared';

import { BankComponent } from './bank';
import { ServiceComponent } from './service';
import { ServiceJoinComponent } from './service-join';
import { ServiceListComponent } from './service-list';
import { ActivityComponent } from './activity';
import { ActivityListComponent } from './activity-list';
import { WorkerComponent } from './worker';
import { WorkerAddComponent } from './worker-add';
import { OrganizationComponent } from './organization';
import { OrganizationDetailComponent } from './organization-detail';
import { BankChildComponent } from './bank-child';
import { QuestionComponent } from './question';
import { AnswerComponent } from './answer';
import { ConfirmAnswerComponent } from './confirm-answer';
import { RankAnswerComponent } from './answer-rank';
import { BidComponent } from './bid';

const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: '/bank/home/0',
      },
      {
        path: 'home/:id',
        pathMatch: 'full',
        component: BankComponent,
      },
      {
        path: 'child/:id',
        pathMatch: 'full',
        component: BankChildComponent,
      },
      {
        path: 'question/:id',
        pathMatch: 'full',
        component: QuestionComponent,
      },
      {
        path: 'question/:id/answer',
        pathMatch: 'full',
        component: AnswerComponent,
      },
      {
        path: 'confirm/answer/:id',
        canActivate: [AuthorizeGuard],
        pathMatch: 'full',
        component: ConfirmAnswerComponent,
      },
      {
        path: 'rank/answer/:id',
        canActivate: [AuthorizeGuard],
        pathMatch: 'full',
        component: RankAnswerComponent,
      },
      {
        path: 'question/:id/answer/bid',
        canActivate: [AuthorizeGuard],
        pathMatch: 'full',
        component: BidComponent,
      },
      {
        path: 'service/:id',
        pathMatch: 'full',
        component: ServiceComponent,
      },
      {
        path: 'service/:id/join',
        canActivate: [AuthorizeGuard],
        pathMatch: 'full',
        component: ServiceJoinComponent,
      },
      {
        path: 'services',
        pathMatch: 'full',
        component: ServiceListComponent,
      },
      {
        path: 'worker/add/:id',
        canActivate: [AuthorizeGuard],
        pathMatch: 'full',
        component: WorkerAddComponent,
      },
      {
        path: 'organization/detail/:id',
        pathMatch: 'full',
        component: OrganizationDetailComponent,
      },
      {
        path: 'worker',
        pathMatch: 'full',
        component: OrganizationComponent,
      },
      {
        path: 'activity/:id',
        component: ActivityComponent,
      },
      {
        path: 'activities',
        component: ActivityListComponent,
      }
    ],
  },
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    FormsModule,

    SharedModule,
    NgvModule,
  ],
  declarations: [
    BankComponent,
    ServiceComponent,
    ServiceListComponent,
    ActivityComponent,
    ActivityListComponent,
    WorkerComponent,
    WorkerAddComponent,
    OrganizationComponent,
    OrganizationDetailComponent,
    ServiceJoinComponent,
    BankChildComponent,
    QuestionComponent,
    AnswerComponent,
    ConfirmAnswerComponent,
    RankAnswerComponent,
    BidComponent,
  ]
})
export class BankModule {
}

export * from './bank';
export * from './service';
