var uuid = require('uuid/v4');

function id() {
return uuid().replace('/-/g', '');
}

var ids = [];

for (var i = 0; i < 7; i++) {
  ids.push(id());
}

exports.seed = function(knex, Promise) {
  return Promise.all([
    knex('t_bank_menu').insert({id: id[0], name: '社工参与', icon: 'http://www.crowdnear.com/m2/assets/images/ios/@2x/sgcy@2x.png', url:'', parentId: '', sort: 10}),
    knex('t_bank_menu').insert({id: id[1], name: '活动公告', icon: 'http://www.crowdnear.com/m2/assets/images/ios/@2x/bgt@2x.png', url:'', parentId: '', sort: 20}),
    knex('t_bank_menu').insert({id: id[2], name: '事项公示', icon: 'http://www.crowdnear.com/m2/assets/images/ios/@2x/sxgs@2x.png', url:'', parentId: '', sort: 30}),
    knex('t_bank_menu').insert({id: id[3], name: '邻里互助', icon: 'http://www.crowdnear.com/m2/assets/images/ios/@2x/llhz@2x.png', url:'', parentId: '', sort: 40}),
    knex('t_bank_menu').insert({id: id[4], name: '服务自选', icon: 'http://www.crowdnear.com/m2/assets/images/ios/@2x/fwzx@2x.png', url:'', parentId: '', sort: 50}),
    knex('t_bank_menu').insert({id: id[5], name: '慈善同行', icon: 'http://www.crowdnear.com/m2/assets/images/ios/@2x/cstx@2x.png', url:'', parentId: '', sort: 60}),
    knex('t_bank_menu').insert({id: id[6], name: '公益排行', icon: 'http://www.crowdnear.com/m2/assets/images/ios/@2x/gyph@2x.png', url:'', parentId: '', sort: 70}),

    // 子项
    knex('t_bank_menu').insert({id: id(), name: '咨询', icon: 'http://www.crowdnear.com/m2/assets/images/ios/@2x/zx@2x.png', url:'', parentId: id[3], sort: 10}),
    knex('t_bank_menu').insert({id: id(), name: '介绍', icon: 'http://www.crowdnear.com/m2/assets/images/ios/@2x/js@2x.png', url:'', parentId: id[3], sort: 20}),
    knex('t_bank_menu').insert({id: id(), name: '辅导', icon: 'http://www.crowdnear.com/m2/assets/images/ios/@2x/fd@2x.png', url:'', parentId: id[3], sort: 30}),
    knex('t_bank_menu').insert({id: id(), name: '陪护', icon: 'http://www.crowdnear.com/m2/assets/images/ios/@2x/ph@2x.png', url:'', parentId: id[3], sort: 40}),
    knex('t_bank_menu').insert({id: id(), name: '维修', icon: 'http://www.crowdnear.com/m2/assets/images/ios/@2x/wx@2x.png', url:'', parentId: id[3], sort: 50}),
    knex('t_bank_menu').insert({id: id(), name: '代购', icon: 'http://www.crowdnear.com/m2/assets/images/ios/@2x/dg@2x.png', url:'', parentId: id[3], sort: 60}),
    knex('t_bank_menu').insert({id: id(), name: '托管', icon: 'http://www.crowdnear.com/m2/assets/images/ios/@2x/tg@2x.png', url:'', parentId: id[3], sort: 70}),
    knex('t_bank_menu').insert({id: id(), name: '出借', icon: 'http://www.crowdnear.com/m2/assets/images/ios/@2x/cj@2x.png', url:'', parentId: id[3], sort: 80}),
    knex('t_bank_menu').insert({id: id(), name: '折送', icon: 'http://www.crowdnear.com/m2/assets/images/ios/@2x/ph@2x.png', url:'', parentId: id[3], sort: 90}),
    knex('t_bank_menu').insert({id: id(), name: '顺搭', icon: 'http://www.crowdnear.com/m2/assets/images/ios/@2x/fd@2x.png', url:'', parentId: id[3], sort: 100}),

    // 子项
    knex('t_bank_menu').insert({id: id(), name: '咨询', icon: 'http://www.crowdnear.com/m2/assets/images/ios/@2x/zx@2x.png', url:'', parentId: id[4], sort: 10}),
    knex('t_bank_menu').insert({id: id(), name: '介绍', icon: 'http://www.crowdnear.com/m2/assets/images/ios/@2x/js@2x.png', url:'', parentId: id[4], sort: 20}),
    knex('t_bank_menu').insert({id: id(), name: '辅导', icon: 'http://www.crowdnear.com/m2/assets/images/ios/@2x/fd@2x.png', url:'', parentId: id[4], sort: 30}),
    knex('t_bank_menu').insert({id: id(), name: '陪护', icon: 'http://www.crowdnear.com/m2/assets/images/ios/@2x/ph@2x.png', url:'', parentId: id[4], sort: 40}),
    knex('t_bank_menu').insert({id: id(), name: '维修', icon: 'http://www.crowdnear.com/m2/assets/images/ios/@2x/wx@2x.png', url:'', parentId: id[4], sort: 50}),
    knex('t_bank_menu').insert({id: id(), name: '代购', icon: 'http://www.crowdnear.com/m2/assets/images/ios/@2x/dg@2x.png', url:'', parentId: id[4], sort: 60}),
    knex('t_bank_menu').insert({id: id(), name: '托管', icon: 'http://www.crowdnear.com/m2/assets/images/ios/@2x/tg@2x.png', url:'', parentId: id[4], sort: 70}),
    knex('t_bank_menu').insert({id: id(), name: '出借', icon: 'http://www.crowdnear.com/m2/assets/images/ios/@2x/cj@2x.png', url:'', parentId: id[4], sort: 80}),
    knex('t_bank_menu').insert({id: id(), name: '折送', icon: 'http://www.crowdnear.com/m2/assets/images/ios/@2x/ph@2x.png', url:'', parentId: id[4], sort: 90}),
    knex('t_bank_menu').insert({id: id(), name: '顺搭', icon: 'http://www.crowdnear.com/m2/assets/images/ios/@2x/fd@2x.png', url:'', parentId: id[4], sort: 100}),

    // 子项
    knex('t_bank_menu').insert({id: id(), name: '咨询', icon: 'http://www.crowdnear.com/m2/assets/images/ios/@2x/zx@2x.png', url:'', parentId: id[5], sort: 10}),
    knex('t_bank_menu').insert({id: id(), name: '介绍', icon: 'http://www.crowdnear.com/m2/assets/images/ios/@2x/js@2x.png', url:'', parentId: id[5], sort: 20}),
    knex('t_bank_menu').insert({id: id(), name: '辅导', icon: 'http://www.crowdnear.com/m2/assets/images/ios/@2x/fd@2x.png', url:'', parentId: id[5], sort: 30}),
    knex('t_bank_menu').insert({id: id(), name: '陪护', icon: 'http://www.crowdnear.com/m2/assets/images/ios/@2x/ph@2x.png', url:'', parentId: id[5], sort: 40}),
    knex('t_bank_menu').insert({id: id(), name: '维修', icon: 'http://www.crowdnear.com/m2/assets/images/ios/@2x/wx@2x.png', url:'', parentId: id[5], sort: 50}),
    knex('t_bank_menu').insert({id: id(), name: '代购', icon: 'http://www.crowdnear.com/m2/assets/images/ios/@2x/dg@2x.png', url:'', parentId: id[5], sort: 60}),
    knex('t_bank_menu').insert({id: id(), name: '托管', icon: 'http://www.crowdnear.com/m2/assets/images/ios/@2x/tg@2x.png', url:'', parentId: id[5], sort: 70}),
    knex('t_bank_menu').insert({id: id(), name: '出借', icon: 'http://www.crowdnear.com/m2/assets/images/ios/@2x/cj@2x.png', url:'', parentId: id[5], sort: 80}),
    knex('t_bank_menu').insert({id: id(), name: '折送', icon: 'http://www.crowdnear.com/m2/assets/images/ios/@2x/ph@2x.png', url:'', parentId: id[5], sort: 90}),
    knex('t_bank_menu').insert({id: id(), name: '顺搭', icon: 'http://www.crowdnear.com/m2/assets/images/ios/@2x/fd@2x.png', url:'', parentId: id[5], sort: 100}),
  ]);
};
