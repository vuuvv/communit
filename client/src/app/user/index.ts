import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { NgvModule } from '../../components';

import { SharedModule } from '../shared';

import { UserComponent } from './user';
import { VerifyComponent } from './verify';
import { SignupComponent } from './signup';
import { QrcodeComponent } from './qrcode';

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
      {
        path: 'signup',
        pathMatch: 'full',
        component: SignupComponent,
      },
      {
        path: 'qr/:id',
        pathMatch: 'full',
        component: QrcodeComponent,
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
  ]
})
export class UserModule {
}

export * from './user';
