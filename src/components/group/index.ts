import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';

import { GroupComponent } from './group';

@NgModule({
  imports: [ CommonModule ],
  exports: [ GroupComponent ],
  declarations: [ GroupComponent ],
})
export class GroupModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: GroupModule,
      providers: [],
    }
  }
}

export * from './group';
