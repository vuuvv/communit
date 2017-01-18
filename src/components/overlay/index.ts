import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';


import { OverlayService } from './overlay.service';
import { DialogService } from './dialog.service';

import { Overlay, OverlayComponent } from './overlay';

import { AlertComponent } from './alert.component';
import { ConfirmComponent } from './confirm.component';

@NgModule({
  imports: [
    RouterModule,
    CommonModule,
  ],
  declarations: [
    Overlay,
    OverlayComponent,
    AlertComponent,
    ConfirmComponent,
  ],
  exports: [
    Overlay,
  ],
  entryComponents: [
    AlertComponent,
    ConfirmComponent,
  ]
})
export class OverlayModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: OverlayModule,
      providers: [OverlayService, DialogService],
    }
  }
}

export * from './overlay.service';
export * from './dialog.service';
export * from './overlay';
