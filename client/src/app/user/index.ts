import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { NgvModule } from '../../components';

import { SharedModule, AuthorizeGuard } from '../shared';

import { UserComponent } from './user';
import { VerifyComponent } from './verify';
import { SignupComponent } from './signup';
import { QrcodeComponent } from './qrcode';
import { OrderListComponent } from './order-list';
import { WorkerComponent } from './worker';
import { PointsComponent } from './points';
import { TestComponent } from './test';

const routes: Routes = [
  {
    path: 'user',
    children: [
      {
        path: '',
        pathMatch: 'full',
        canActivate: [AuthorizeGuard],
        component: UserComponent,
      },
      {
        path: 'verify',
        pathMatch: 'full',
        component: VerifyComponent,
      },
      {
        path: 'signup',
        pathMatch: 'full',
        component: SignupComponent,
      },
      {
        path: 'qr/:id',
        pathMatch: 'full',
        canActivate: [AuthorizeGuard],
        component: QrcodeComponent,
      },
      {
        path: ':type/orders',
        pathMatch: 'full',
        canActivate: [AuthorizeGuard],
        component: OrderListComponent,
      },
      {
        path: 'worker',
        pathMatch: 'full',
        canActivate: [AuthorizeGuard],
        component: WorkerComponent,
      },
      {
        path: 'points',
        pathMatch: 'full',
        canActivate: [AuthorizeGuard],
        component: PointsComponent,
      },
      {
        path: 'test',
        pathMatch: 'full',
        canActivate: [AuthorizeGuard],
        component: TestComponent,
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
    UserComponent,
    VerifyComponent,
    SignupComponent,
    QrcodeComponent,
    OrderListComponent,
    WorkerComponent,
    PointsComponent,
    TestComponent,
  ]
})
export class UserModule {
}

export * from './user';
