import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';

@Component({
  templateUrl: './store-apply.html',
})
export class StoreApplyComponent implements OnInit {
  status: string;

  constructor(
    private route: ActivatedRoute,
  ) {}

  ngOnInit() {
    this.route.params.forEach((params: Params) =>{
      this.status = params['status'];
    });
  }
}
