/* eslint-disable global-require */

import Vue from 'vue';
import Router from 'vue-router';

Vue.use(Router);

const Community = r => require.ensure([], () => r(require('../page/community')), 'community');
const Bank = r => require.ensure([], () => r(require('../page/bank')), 'bank');
const Market = r => require.ensure([], () => r(require('../page/market')), 'market');
const User = r => require.ensure([], () => r(require('../page/user')), 'user');

const routes = [
  {
    path: '',
    redirect: '/community',
  },
  {
    path: '/community',
    name: 'community',
    component: Community,
  },
  {
    path: '/bank',
    name: 'bank',
    component: Bank,
  },
  {
    path: '/market',
    name: 'market',
    component: Market,
  },
  {
    path: '/user',
    name: 'user',
    component: User,
  },
];

export default new Router({
  routes,
});
