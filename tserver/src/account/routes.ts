import { router, get, post, success, Response, ResponseError, login } from '../routes';
import { Table, first, raw, db } from '../db';
import { create, getJsonBody } from '../utils';
import { Store } from '../models';

@router('/store')
export class StoreController {
  @get('/')
  @login
  async store(ctx) {
  }

  @post('/add')
  @login
  async add(ctx) {
  }

  @post('/edit')
  @login
  async edit(ctx) {
  }
}
