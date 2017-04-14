import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { NgvModule } from '../../components';

import { SharedModule, AuthorizeGuard } from '../shared';

import { StoreComponent, StoreAddComponent, StoreEditComponent } from './store';
import { ProductAddComponent, ProductEditComponent } from './product';
import { ProductDetailComponent } from './product-detail';

const routes: Routes = [
  {
    path: 'store',
    canActivateChild: [AuthorizeGuard],
    children: [
      {
        path: '',
        redirectTo: '/store/page/0',
        pathMatch: 'full',
      },
      {
        path: 'page/:id',
        pathMatch: 'full',
        component: StoreComponent,
      },
      {
        path: 'add',
        pathMatch: 'full',
        component: StoreAddComponent,
      },
      {
        path: 'edit',
        pathMatch: 'full',
        component: StoreEditComponent,
      },
      {
        path: 'product/add',
        pathMatch: 'full',
        component: ProductAddComponent,
      },
      {
        path: 'product/edit/:id',
        pathMatch: 'full',
        component: ProductEditComponent,
      },
      {
        path: 'product/item/:id',
        pathMatch: 'full',
        component: ProductDetailComponent,
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
    StoreComponent,
    StoreAddComponent,
    StoreEditComponent,
    ProductAddComponent,
    ProductEditComponent,
    ProductDetailComponent,
  ]
})
export class StoreModule {
}

export * from './store';
