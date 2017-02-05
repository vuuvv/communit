import { NgModule, ModuleWithProviders } from '@angular/core';

import { PageComponent } from './page';

@NgModule({
  declarations: [ PageComponent ],
  exports: [ PageComponent ],
})
export class PageModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: PageModule,
      providers: [],
    }
  }
}

export * from './page';
