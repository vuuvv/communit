import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';

import { Http, FormService, WechatService } from '../shared';
import { OverlayService, DialogService } from '../../components';

const validMessages = {
  name: {
    required: '请填写店铺名称',
  },
  legalRepresentative: {
    required: '请填写法人代表',
  },
  legalRepresentativeTel: {
    required: '请填写法人代表手机',
  },
  businessScope: {
    required: '请填写经营范围',
  },
  contact: {
    required: '请填写联系人',
  },
  tel: {
    required: '请填写联系方式',
  },
  description: {
    required: '请填写店铺简介',
  },
  address: {
    required: '请填写店铺地址',
  },
};

@Component({
  templateUrl: './store.html',
  styleUrls: ['./store.less'],
  encapsulation: ViewEncapsulation.None,
})
export class StoreComponent implements OnInit {
  store: any;
  products: any[];
  orders: any[];
  accounts: any[];
  tabs = ['订单', '商品', '积分'];
  currentIndex;

  constructor(
    private http: Http,
    private overlayService: OverlayService,
    private route: ActivatedRoute,
  ) {}

  ngOnInit() {
    this.overlayService.loading();
    this.route.params.concatMap((params: Params) => {
      this.currentIndex = params['id'];
      return this.http.get('/store');
    }).subscribe((ret: any) => {
      this.store = ret.store;
      this.products = ret.products;
      this.orders = ret.orders;
      this.accounts = ret.accounts;
      this.overlayService.hideToast();
      setTimeout(() => {
        this.currentIndex = 0;
      }, 0);
    });
  }

  get isNormal() {
    return this.store && this.store.status === 'normal';
  }

  get isSubmit() {
    return this.store && this.store.status === 'submit';
  }

  get isEmpty() {
    return !this.products || this.products.length;
  }
}

@Component({
  templateUrl: './store-form.html',
  styleUrls: ['./store-form.less'],
})
export class StoreAddComponent {
  title = '申请店铺';
  store: any = {};
  actionsShown = false;
  communityId;
  photoField;

  constructor(
    private http: Http,
    private router: Router,
    private formService: FormService,
    private wechatService: WechatService,
    private dialogService: DialogService,
  ) {}

  submit(form) {
    this.formService.submit(form, validMessages, '/store/add', this.store).subscribe(() => {
      this.router.navigate(['/store']);
    });
  }

  selectPhoto() {
    this.actionsShown = false;

    this.wechatService.chooseImage().then((localIds) => {
      return this.wechatService.uploadImage(localIds[0]);
    }).then((serverId: string) => {
      this.wechatService.getCommunityId().subscribe((communityId: string) => {
        this.communityId = communityId;
        this.store[this.photoField] = this.wechatService.previewUrl(communityId, serverId);
      });
    });
  }

  previewPhotos() {
    this.actionsShown = false;

    let photo = this.store[this.photoField];
    if (!photo) {
      this.dialogService.alert('请先上传图片');
      return;
    }

    let serversId = ['licenseImage', 'legalRepresentativeImage']
      .filter((v) => v && this.photoField !== v)
      .map((v) => this.store[v]);

    serversId.unshift(photo);

    console.log(serversId);
    this.wechatService.previewImage(serversId, this.communityId, false);
  }

  showActions(photoField) {
    this.actionsShown = true;
    this.photoField = photoField;
  }
}

@Component({
  selector: 'store-edit',
  templateUrl: './store-form.html',
  styleUrls: ['./store-form.less'],
})
export class StoreEditComponent implements OnInit {
  title = '编辑店铺';
  store: any = {};
  products: any[] = [];

  constructor(
    private http: Http,
    private router: Router,
    private formService: FormService,
  ) {}

  ngOnInit() {
    this.http.get('/store').subscribe((ret: any) => {
      this.store = ret.store;
    });
  }

  submit(form) {
    this.formService.submit(form, validMessages, '/store/edit', this.store).subscribe(() => {
      this.router.navigate(['/store']);
    });
  }
}
