import { Component, OnInit } from '@angular/core';
import { Http } from '../shared';
import { OverlayService } from '../../components';

@Component({
  templateUrl: './user.html',
  styleUrls: ['./user.less'],
})
export class UserComponent implements OnInit {
  private user: any = {};
  private store: any;

  constructor(
    private http: Http,
    private overlayService: OverlayService
  ) {
  }

  ngOnInit() {
    this.overlayService.loading();
    this.http.get('/user/me').subscribe((value: any) => {
      this.overlayService.hideToast();
      this.user = value.user;
      this.store = value.store;
    });
  }
}
