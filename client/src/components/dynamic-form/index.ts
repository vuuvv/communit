import { NgModule, ModuleWithProviders } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { CellModule } from '../cell';
import { GroupModule } from '../group';

import { DynamicFormComponent } from './dynamic-form';

@NgModule({
  imports: [ CommonModule, ReactiveFormsModule, CellModule, GroupModule ],
  exports: [ DynamicFormComponent ],
  declarations: [ DynamicFormComponent ],
})
export class DynamicFormModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: DynamicFormModule,
      providers: [],
    };
  }
}

export * from './input-base';
export * from './input-text';
export * from './input-select';
export * from './control.service';
export * from './dynamic-form';
