import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';

import { IconModule } from '../icon';
import { BaseModule } from '../base';
import { RankComponent } from './rank';

@NgModule({
  imports: [ CommonModule, IconModule, BaseModule ],
  exports: [ RankComponent ],
  declarations: [ RankComponent ],
})
export class RankModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: RankModule,
      providers: [],
    };
  }
}

export * from './rank';
