import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { SearchbarComponent } from './searchbar';

@NgModule({
  imports: [ CommonModule, FormsModule ],
  exports: [ SearchbarComponent ],
  declarations: [ SearchbarComponent ],
})
export class SearchbarModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: SearchbarModule,
      providers: [],
    };
  }
}

export * from './searchbar';
