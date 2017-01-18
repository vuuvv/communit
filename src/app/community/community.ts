import { Component } from '@angular/core';

import { OverlayService, DialogService } from '../../components';
import { Http } from '../shared';

@Component({
  templateUrl: './community.html',
  styleUrls: ['./community.less'],
})
export class CommunityComponent {
  constructor(private overlayService: OverlayService, private dialogService: DialogService, private http: Http) {
  }

  toast() {
    this.dialogService.alert('hi');
    this.http.get('http://central.huijinet.com/mo/me').subscribe((value) => {
      console.log(value);
    })
  }
}
