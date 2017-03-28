import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { NgForm } from '@angular/forms';

import { Observable } from 'rxjs/Observable';

import { Http, FormService } from '../shared';
import { DialogService, OverlayService } from '../../components';

@Component({
  templateUrl: './signup.html',
  styleUrls: ['./signup.less'],
})
export class SignupComponent implements OnInit {
  user: any = {};
  phone: string = '';
  communityId: string;
  biotopes: any[] = [];

  private validMessages = {
    name: {
      required: '请填写您的真实姓名',
    },
    address: {
      required: '请填写您的门牌号',
    },
  };

  constructor(
    private http: Http,
    private router: Router,
    private route: ActivatedRoute,
    private overlayService: OverlayService,
    private dialogService: DialogService,
    private formService: FormService,
  ) {
  }

  ngOnInit() {
    this.overlayService.loading();
    Observable.forkJoin(
      this.http.get<string>('/signup/verify'),
      this.http.get('/user/biotope'),
    ).subscribe((values: any[]) => {
      this.overlayService.hideToast();
      this.phone = values[0];
      this.biotopes = values[1] || [];
      this.biotopes.push({
        id: '',
        name: '其他'
      });
      this.user.biotope = this.biotopes[0].id;
    });
  }

  submit(form: NgForm) {
    if (this.user && (!this.user.biotope && !this.user.area)) {
      this.dialogService.alert('请填写或选择您的小区');
      return;
    }

    this.formService.submit(form, this.validMessages, `/signup/create`, this.user).subscribe((value) => {
      this.router.navigate(['/user']);
    });
  }
}
