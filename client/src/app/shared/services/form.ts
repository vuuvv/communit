import { Injectable } from '@angular/core';
import { NgForm } from '@angular/forms';

import { Observable } from 'rxjs/Observable';

import { Http } from './http';

import { DialogService, OverlayService } from '../../../components';

@Injectable()
export class FormService {
  constructor(
    private dialogService: DialogService,
    private overlayService: OverlayService,
    private http: Http,
  ) {}

  submit(form: NgForm, messages: any, url: string, data: any) {
    if (form.invalid) {
      for (let name of Object.keys(form.controls)) {
        let control = form.controls[name];
        if (control.invalid) {
          for (let rule of Object.keys(control.errors)) {
            let message = messages[name][rule] || '错误';
            this.dialogService.alert(message, '错误');
            return Observable.empty();
          }
        }
      }
      return Observable.empty();
    }

    this.overlayService.loading();
    return this.http.json(url, data).map((value) => {
      this.overlayService.hideToast();
      return value;
    });
  }
}
