import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

import { NgvModule } from '../../components';

import { SharedModule, AuthorizeGuard } from '../shared';

import { PublishComponent } from './publish.component';
import { ActionComponent } from './action.component';
import { ActivityComponent } from './activity';
import { QuestionComponent } from './question';

const routes: Routes = [
  {
    path: '',
    canActivateChild: [AuthorizeGuard],
    children: [
      {
        path: 'action/:type',
        component: ActionComponent,
      },
      {
        path: 'activity',
        pathMatch: 'full',
        component: ActivityComponent,
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
    FormsModule,
    RouterModule.forChild(routes),

    SharedModule,
    NgvModule,
  ],
  declarations: [
    ActionComponent,
    PublishComponent,
    ActivityComponent,
    QuestionComponent,
  ]
})
export class PublishModule {
}

