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
import { HelpComponent } from './help';
import { ServiceComponent } from './service';

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
      {
        path: 'question',
        pathMatch: 'full',
        component: QuestionComponent,
      },
      {
        path: 'help',
        pathMatch: 'full',
        component: HelpComponent,
      },
      {
        path: 'service',
        pathMatch: 'full',
        component: ServiceComponent,
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
    HelpComponent,
    ServiceComponent,
  ]
})
export class PublishModule {
}

