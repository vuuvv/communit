import { BrowserModule } from '@angular/platform-browser';
import { NgModule, ModuleWithProviders } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { RouterModule, Routes, PreloadAllModules } from '@angular/router';

import { AppComponent } from './app.component';

import { NgvModule } from '../components';

import { SharedModule } from './shared';
import { CommunityModule } from './community';
import { ArticleModule } from './article';

const appRoutes: Routes = [
  {
    path: '',
    redirectTo: '/community',
    pathMatch: 'full',
  },
  {
    path: 'user',
    loadChildren: 'app/user/index#UserModule',
  },
  {
    path: 'bank',
    loadChildren: 'app/bank/index#BankModule',
  },
  {
    path: 'market',
    loadChildren: 'app/market/index#MarketModule',
  },
  {
    path: 'publish',
    loadChildren: 'app/publish/index#PublishModule',
  },
  {
    path: 'store',
    loadChildren: 'app/store/index#StoreModule',
  },
];
export const routing: ModuleWithProviders = RouterModule.forRoot(appRoutes, { useHash: true, preloadingStrategy: PreloadAllModules });

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,

    routing,

    NgvModule.forRoot(),
    SharedModule.forRoot(),

    CommunityModule,
    ArticleModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
