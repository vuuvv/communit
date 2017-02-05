import { Injectable } from '@angular/core';

import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
import 'rxjs/add/operator/concatMap';
import 'rxjs/add/operator/map';

import { OverlayService } from './overlay.service';
import { ConfirmComponent } from './confirm.component';
import { AlertComponent } from './alert.component';

export class AlertResult {
  constructor(
    private observable: Observable<AlertComponent>,
    private okSub: Subscription) {
  }

  ok<T>(handler: (comp: AlertComponent) => T): Observable<T> {
    this.okSub.unsubscribe();
    return this.observable.concatMap((component, index) => component.getOkObservable()).map(handler);
  }
}

export class ConfirmResult {
  constructor(
    private observable: Observable<ConfirmComponent>,
    private okSub: Subscription,
    private cancelSub: Subscription) {
  }

  ok(handler: (comp: ConfirmComponent) => any): ConfirmResult {
    this.okSub.unsubscribe();
    this.observable.concatMap((component, index) => component.getOkObservable()).subscribe(handler);
    return this;
  }

  cancel(handler: (value: ConfirmComponent) => any): ConfirmResult {
    this.cancelSub.unsubscribe();
    this.observable.concatMap((component, index) => component.getCancelObservable()).subscribe(handler);
    return this;
  }
}

@Injectable()
export class DialogService {
  constructor(private overlayService: OverlayService) {
  }

  alert(content: string, title: string = null): AlertResult {
    if (content && content.length > 200) {
      content = content.substring(0, 200);
    }
    let data = {
      content: content,
    }

    if (title) {
      data['title'] = title;
    }

    let instanceObservable = this.overlayService.create(AlertComponent, data).map((config, index) => {
      return <AlertComponent>config.instance;
    });

    let closeAction = (comp: AlertComponent) => comp.close();

    let okSub = instanceObservable.concatMap((comp, i) => comp.getOkObservable()).subscribe(closeAction);

    return new AlertResult(instanceObservable, okSub);
  }

  confirm(content: string, title: string = null): ConfirmResult {
    if (content && content.length > 200) {
      content = content.substring(0, 200);
    }
    let data = {
      content: content,
    }
    if (title) {
      data['title'] = title;
    }
    let instanceObservable = this.overlayService.create(ConfirmComponent, data).map((config, index) => {
      return <ConfirmComponent>config.instance;
    });

    let closeAction = (comp: ConfirmComponent) => comp.close();

    let okSub = instanceObservable.concatMap((comp, i) => comp.getOkObservable()).subscribe(closeAction);

    let cancelSub = instanceObservable.concatMap((comp, i) => comp.getCancelObservable()).subscribe(closeAction);

    return new ConfirmResult(instanceObservable, okSub, cancelSub);
  }
}
