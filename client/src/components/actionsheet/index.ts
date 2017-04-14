import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InlineDescModule } from '../inline-desc';

import { ActionSheetComponent, ActionSheetItemComponent } from './actionsheet';
import { IconModule } from '../icon';

@NgModule({
  imports: [ CommonModule, InlineDescModule, IconModule ],
  exports: [ ActionSheetComponent, ActionSheetItemComponent ],
  declarations: [ ActionSheetComponent, ActionSheetItemComponent ],
})
export class ActionSheetModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: ActionSheetModule,
      providers: [],
    };
  }
}

export * from './actionsheet';
