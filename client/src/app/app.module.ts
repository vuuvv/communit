import { BrowserModule } from '@angular/platform-browser';
import { NgModule, ModuleWithProviders } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { RouterModule, Routes } from '@angular/router';

import { AppComponent } from './app.component';

import { NgvModule } from '../components';

import { SharedModule } from './shared';
import { CommunityModule } from './community';
import { BankModule } from './bank';
import { MarketModule } from './market';
import { UserModule } from './user';
import { PublishModule } from './publish';
import { ArticleModule } from './article';

const appRoutes: Routes = [
  {
    path: '',
    redirectTo: '/community',
    pathMatch: 'full',
  }
];
export const routing: ModuleWithProviders = RouterModule.forRoot(appRoutes, { useHash: true });

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
    BankModule,
    MarketModule,
    UserModule,
    PublishModule,
    ArticleModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
