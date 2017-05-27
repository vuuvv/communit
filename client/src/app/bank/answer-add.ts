import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Location } from '@angular/common';


import { Http, AuthorizeService, sumBy } from '../shared';
import { OverlayService, DialogService } from '../../components';

@Component({
  templateUrl: './answer-add.html',
  styleUrls: ['./answer-add.less'],
  encapsulation: ViewEncapsulation.None,
})
export class AddAnswerComponent implements OnInit {
  question: any;
  answer: any = {};

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
      return this.http.get(`/service/question/item/${params['id']}`);
    }).subscribe((question) => {
      this.question = question;
    });
  }

  back() {
    this.location.back();
  }

  submit() {
    if (!this.answer) {
      return;
    }

    if (this.question.category === 'help') {
      if (!this.answer.points) {
        this.dialogService.alert('请填写积分');
        return;
      }
    }

    if (!this.answer.content) {
      this.dialogService.alert(this.contentPlaceholder);
      return;
    }

    this.http.json(`/service/question/${this.question.id}/answer/add`, this.answer).subscribe(() => {
      this.router.navigate([`/user/service/${this.question.category}/1`]);
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
      case 'question':
        return `请输入对该问题的回答`;
      case 'help':
        return `请介绍自己和你对该求助的看法`;
      case 'service':
        return `请给对方留言，如需修改积分价格，请留下联系方式，双方联系后确认并由对方修改积分价格，然后你确认支付`;
    }

    return '';
  }

  get title() {
    if (!this.question) {
      return '';
    }

    switch (this.question.category) {
      case 'question':
        return `来自${this.question.realname}的提问`;
      case 'help':
        return `来自${this.question.realname}的求助`;
      case 'service':
        return `${this.question.realname}提供的服务`;
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
