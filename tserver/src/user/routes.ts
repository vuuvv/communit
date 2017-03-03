import { router, get, post, all, success, Response, ResponseError, login } from '../routes';
import { Table } from '../db';
import { create } from '../utils';

@router('/user')
export class UserController {

  @get('/me')
  @login
  async me(ctx) {
    let user = await Table.User.where('id', ctx.session.userId).first();
    return success(user);
  }

  @get('/test')
  async hello() {
    return 'hello';
  }
}
