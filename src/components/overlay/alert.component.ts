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
  templateUrl: './alert.html',
})
export class AlertComponent {
  @Input('title') title: string = '请注意';
  @Input('content') content: string;

  private okEmitter: EventEmitter<AlertComponent> = new EventEmitter<AlertComponent>();

  constructor(private overlayService: OverlayService) {
  }

  ok() {
    this.okEmitter.next(this);
  }

  close() {
    this.overlayService.close(this);
  }

  getOkObservable(): Observable<AlertComponent> {
    return this.okEmitter.asObservable();
  }
}
