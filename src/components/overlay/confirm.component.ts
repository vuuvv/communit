import {
 Component,
 EventEmitter,
 ViewEncapsulation,
 OnInit,
 Input,
} from '@angular/core';

import { Observable } from 'rxjs/Observable';

import { OverlayService } from './overlay.service';

@Component({
  templateUrl: './confirm.html',
})
export class ConfirmComponent {
  @Input('title') title: string = '请确认';
  @Input('content') content: string;

  private cancelEmitter: EventEmitter<ConfirmComponent> = new EventEmitter<ConfirmComponent>();
  private okEmitter: EventEmitter<ConfirmComponent> = new EventEmitter<ConfirmComponent>();

  constructor(private overlayService: OverlayService) {
  }

  cancel() {
    this.cancelEmitter.next(this);
  }

  ok() {
    this.okEmitter.next(this);
  }

  close() {
    this.overlayService.close(this);
  }

  getCancelObservable(): Observable<ConfirmComponent> {
    return this.cancelEmitter.asObservable();
  }

  getOkObservable(): Observable<ConfirmComponent> {
    return this.okEmitter.asObservable();
  }
}
