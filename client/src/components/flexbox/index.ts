import { NgModule, ModuleWithProviders } from '@angular/core';
import { FlexboxComponent, FlexboxItemComponent } from './flexbox';

@NgModule({
  declarations: [ FlexboxComponent, FlexboxItemComponent ],
  exports: [ FlexboxComponent, FlexboxItemComponent ],
})
export class FlexBoxModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: FlexBoxModule,
    }
  }
}

export * from './flexbox';
