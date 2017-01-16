import { BrowserModule } from '@angular/platform-browser';
import { NgModule, ModuleWithProviders } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { RouterModule, Routes } from '@angular/router';

import { AppComponent } from './app.component';
import { TestComponent, TestContainerComponent } from './test.component';

import { NgvModule } from '../components';

const appRoutes: Routes = [];
export const routing: ModuleWithProviders = RouterModule.forRoot(appRoutes, { useHash: true });

@NgModule({
  declarations: [
    TestComponent,
    TestContainerComponent,
    AppComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,

    routing,

    NgvModule.forRoot(),
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
