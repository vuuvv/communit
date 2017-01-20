import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TabComponent } from './tab';

@NgModule({
  imports: [ CommonModule ],
  exports: [ TabComponent ],
  declarations: [ TabComponent ],
})
export class GroupModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: GroupModule,
      providers: [],
    }
  }
}

export * from './tab';
