import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';

import { NgvModule } from '../../components';

import { SharedModule } from '../shared';

import { MarketComponent } from './market';
import { ProductComponent } from './product';
import { MarketChildComponent } from './market-child';
import { SearchComponent } from './search';

const routes: Routes = [
  {
    path: '',
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
        path: 'child/:id',
        pathMatch: 'full',
        component: MarketChildComponent,
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
    MarketChildComponent,
    SearchComponent,
  ]
})
export class MarketModule {
}

export * from './market';
