import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';

import { NgvModule } from '../../components';

import { SharedModule } from '../shared';

import { MarketComponent } from './market';
import { ProductComponent } from './product';
import { SearchComponent } from './search';

const routes: Routes = [
  {
    path: 'market',
    children: [
      {
        path: '',
        pathMatch: 'full',
        component: MarketComponent,
      },
      {
        path: 'product/:id',
        pathMatch: 'full',
        component: ProductComponent,
      },
      {
        path: 'search',
        pathMatch: 'full',
        component: SearchComponent,
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
    ProductComponent,
    SearchComponent,
  ]
})
export class MarketModule {
}

export * from './market';
