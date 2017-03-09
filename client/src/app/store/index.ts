import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { NgvModule } from '../../components';

import { SharedModule } from '../shared';

import { StoreComponent, StoreAddComponent, StoreEditComponent } from './store';
import { ProductAddComponent, ProductEditComponent } from './product';

const routes: Routes = [
  {
    path: 'store',
    children: [
      {
        path: '',
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
        component: ProductAddComponent,
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
  ]
})
export class StoreModule {
}

export * from './store';
