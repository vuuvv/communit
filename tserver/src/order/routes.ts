import * as _ from 'lodash';

import { router, get, post, success, Response, ResponseError, login } from '../routes';
import { Table, first, raw, db } from '../db';
import { create, getJsonBody, errorPage } from '../utils';
import { Account, Product, Qrcode, QrcodeAction } from '../models';
import { Wechat } from '../wechat';
import { Config } from '../config';

@router('/order')
export class OrderController {
}
