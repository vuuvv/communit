import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';

import { NgvModule } from '../../components';

import { SharedModule } from '../shared';

import { MarketComponent } from './market';

const routes: Routes = [
  {
    path: 'market',
    children: [
      {
        path: '',
        pathMatch: 'full',
        component: MarketComponent,
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
    MarketComponent,
  ]
})
export class MarketModule {
}

export * from './market';
