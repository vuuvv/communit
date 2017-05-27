import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Location } from '@angular/common';


import { Http, AuthorizeService, sumBy } from '../shared';
import { OverlayService, DialogService } from '../../components';

@Component({
  templateUrl: './answer-edit.html',
  styleUrls: ['./answer-edit.less'],
  encapsulation: ViewEncapsulation.None,
})
export class EditAnswerComponent implements OnInit {
  question: any;
  answer: any = {};
  model: any = {};

  constructor(
    private router: Router,
    private http: Http,
    private route: ActivatedRoute,
    private overlayService: OverlayService,
    private authorizeService: AuthorizeService,
    private dialogService: DialogService,
    private location: Location,
  ) {}

  ngOnInit() {
    this.route.params.concatMap((params: Params) => {
      return this.http.get(`/service/answer/${params['id']}`);
    }).subscribe((answer: any) => {
      this.answer = answer.answer;
      this.question = answer.question;
      this.model.points = this.answer.points;
      if (['help', 'service'].indexOf(this.question.category) === -1) {
        this.dialogService.alert('错误的类型').ok((comp) => {
          comp.close();
          this.location.back();
        }).subscribe(() => null);
      }
      if (this.question.category === 'help') {
        this.model.content = this.answer.content;
      } else {
        this.model.content = this.answer.memo;
      }
    });
  }

  back() {
    this.location.back();
  }

  submit() {
    if (!this.model) {
      return;
    }

    if (!this.model.points) {
      this.dialogService.alert('请填写积分');
      return;
    }

    if (!this.model.content) {
      this.dialogService.alert(this.contentPlaceholder);
      return;
    }

    this.overlayService.loading();
    this.http.json(`/service/answer/${this.answer.id}/edit`, this.model).subscribe(() => {
      this.overlayService.hideToast();
      if (this.question.category === 'help') {
        this.router.navigate([`/user/service/help/1`]);
      } else {
        this.router.navigate([`/user/service/service/0`]);
      }
    });
  }

  get isQuestion() {
    return this.question.category === 'question';
  }

  get contentPlaceholder() {
    if (!this.question) {
      return '';
    }

    switch (this.question.category) {
      case 'help':
        return `请介绍自己和你对该求助的看法`;
      case 'service':
        return `请给对方留言`;
    }

    return '';
  }

  get title() {
    if (!this.question) {
      return '';
    }

    switch (this.question.category) {
      case 'help':
        return `编辑对${this.question.realname}的求助`;
      case 'service':
        return `编辑${this.question.realname}的服务订单`;
    }

    return '';
  }

  get label() {
    return {
      question: '回答',
      help: '帮助',
      service: '请求',
    }[this.question.category] || '';
  }
}
