import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TabComponent, TabItemComponent } from './tab';

@NgModule({
  imports: [ CommonModule ],
  exports: [ TabComponent, TabItemComponent ],
  declarations: [ TabComponent, TabItemComponent ],
})
export class TabModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: TabModule,
      providers: [],
    }
  }
}

export * from './tab';
