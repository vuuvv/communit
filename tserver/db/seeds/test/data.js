var uuid = require('uuid/v4');

function id() {
return uuid().replace(/-/g, '');
}

var ids = [];

for (var i = 0; i < 3; i++) {
  ids.push(id());
}

var c1 = [
  {
    key: 'type',
    label: '类型',
    type: 'select',
    require: true,
  },
  {
    key: 'content',
    label: '求助内容',
    type: 'textarea',
    required: true,
  },
  {
    key: 'result',
    label: '达到效果',
    type: 'textarea',
    required: true,
  },
  {
    key: 'requirement',
    label: '人员要求',
    type: 'textarea',
    required: true,
  },
  {
    key: 'points',
    label: '支付积分',
    type: 'number',
    required: true,
  },
];

var c2 = [
  {
    key: 'type',
    label: '类型',
    type: 'select',
    require: true,
  },
  {
    key: 'content',
    label: '服务内容',
    type: 'textarea',
    required: true,
  },
  {
    key: 'date',
    label: '提供时间',
    type: 'textarea',
    required: true,
  },
  {
    key: 'address',
    label: '提供地点',
    type: 'textarea',
    required: true,
  },
  {
    key: 'target',
    label: '服务对象',
    type: 'textarea',
    required: true,
  },
  {
    key: 'count',
    label: '服务人数',
    type: 'number',
    required: true,
  },
  {
    key: 'points',
    label: '支付积分',
    type: 'number',
    required: true,
  },
]

var c3 = [
  {
    key: 'type',
    label: '类型',
    type: 'select',
    require: true,
  },
  {
    key: 'introduction',
    label: '实际情况',
    type: 'textarea',
    required: true,
  },
  {
    key: 'content',
    label: '求助内容',
    type: 'textarea',
    required: true,
  },
  {
    key: 'requirement',
    label: '人员要求',
    type: 'textarea',
    required: true,
  },
  {
    key: 'points',
    label: '支付积分',
    type: 'number',
    required: true,
  },
]

exports.seed = function(knex, Promise) {
  return Promise.all([
    knex('t_service_category').insert({id: ids[0], name: '邻里互助', label: '我要求助', fields: JSON.stringify(c1), sort: 10}),
    knex('t_service_category').insert({id: ids[1], name: '服务自选', label: '发起活动', fields: JSON.stringify(c2), sort: 20}),
    knex('t_service_category').insert({id: ids[2], name: '慈善活动', label: '公益求助', fields: JSON.stringify(c3), sort: 30}),

    knex('t_service_type').insert({id: id(), categoryId: ids[0], name: '咨询', icon: 'http://www.crowdnear.com/m2/assets/images/ios/@2x/zx2@2x.png', sort: 10}),
    knex('t_service_type').insert({id: id(), categoryId: ids[0], name: '介绍', icon: 'http://www.crowdnear.com/m2/assets/images/ios/@2x/js2@2x.png', sort: 20}),
    knex('t_service_type').insert({id: id(), categoryId: ids[0], name: '辅导', icon: 'http://www.crowdnear.com/m2/assets/images/ios/@2x/fd2@2x.png', sort: 30}),
    knex('t_service_type').insert({id: id(), categoryId: ids[0], name: '陪护', icon: 'http://www.crowdnear.com/m2/assets/images/ios/@2x/ph2@2x.png', sort: 40}),
    knex('t_service_type').insert({id: id(), categoryId: ids[0], name: '维修', icon: 'http://www.crowdnear.com/m2/assets/images/ios/@2x/wx2@2x.png', sort: 50}),
    knex('t_service_type').insert({id: id(), categoryId: ids[0], name: '代购', icon: 'http://www.crowdnear.com/m2/assets/images/ios/@2x/dg2@2x.png', sort: 60}),
    knex('t_service_type').insert({id: id(), categoryId: ids[0], name: '托管', icon: 'http://www.crowdnear.com/m2/assets/images/ios/@2x/tg2@2x.png', sort: 70}),
    knex('t_service_type').insert({id: id(), categoryId: ids[0], name: '出借', icon: 'http://www.crowdnear.com/m2/assets/images/ios/@2x/cj2@2x.png', sort: 80}),
    knex('t_service_type').insert({id: id(), categoryId: ids[0], name: '折送', icon: 'http://www.crowdnear.com/m2/assets/images/ios/@2x/ph2@2x.png', sort: 90}),
    knex('t_service_type').insert({id: id(), categoryId: ids[0], name: '顺搭', icon: 'http://www.crowdnear.com/m2/assets/images/ios/@2x/fd2@2x.png', sort: 100}),

    knex('t_service_type').insert({id: id(), categoryId: ids[1], name: '咨询', icon: 'http://www.crowdnear.com/m2/assets/images/ios/@2x/zx2@2x.png', sort: 10}),
    knex('t_service_type').insert({id: id(), categoryId: ids[1], name: '介绍', icon: 'http://www.crowdnear.com/m2/assets/images/ios/@2x/js2@2x.png', sort: 20}),
    knex('t_service_type').insert({id: id(), categoryId: ids[1], name: '辅导', icon: 'http://www.crowdnear.com/m2/assets/images/ios/@2x/fd2@2x.png', sort: 30}),
    knex('t_service_type').insert({id: id(), categoryId: ids[1], name: '陪护', icon: 'http://www.crowdnear.com/m2/assets/images/ios/@2x/ph2@2x.png', sort: 40}),
    knex('t_service_type').insert({id: id(), categoryId: ids[1], name: '维修', icon: 'http://www.crowdnear.com/m2/assets/images/ios/@2x/wx2@2x.png', sort: 50}),
    knex('t_service_type').insert({id: id(), categoryId: ids[1], name: '代购', icon: 'http://www.crowdnear.com/m2/assets/images/ios/@2x/dg2@2x.png', sort: 60}),
    knex('t_service_type').insert({id: id(), categoryId: ids[1], name: '托管', icon: 'http://www.crowdnear.com/m2/assets/images/ios/@2x/tg2@2x.png', sort: 70}),
    knex('t_service_type').insert({id: id(), categoryId: ids[1], name: '出借', icon: 'http://www.crowdnear.com/m2/assets/images/ios/@2x/cj2@2x.png', sort: 80}),
    knex('t_service_type').insert({id: id(), categoryId: ids[1], name: '折送', icon: 'http://www.crowdnear.com/m2/assets/images/ios/@2x/ph2@2x.png', sort: 90}),
    knex('t_service_type').insert({id: id(), categoryId: ids[1], name: '顺搭', icon: 'http://www.crowdnear.com/m2/assets/images/ios/@2x/fd2@2x.png', sort: 100}),

    knex('t_service_type').insert({id: id(), categoryId: ids[2], name: '咨询', icon: 'http://www.crowdnear.com/m2/assets/images/ios/@2x/zx2@2x.png', sort: 10}),
    knex('t_service_type').insert({id: id(), categoryId: ids[2], name: '介绍', icon: 'http://www.crowdnear.com/m2/assets/images/ios/@2x/js2@2x.png', sort: 20}),
    knex('t_service_type').insert({id: id(), categoryId: ids[2], name: '辅导', icon: 'http://www.crowdnear.com/m2/assets/images/ios/@2x/fd2@2x.png', sort: 30}),
    knex('t_service_type').insert({id: id(), categoryId: ids[2], name: '陪护', icon: 'http://www.crowdnear.com/m2/assets/images/ios/@2x/ph2@2x.png', sort: 40}),
    knex('t_service_type').insert({id: id(), categoryId: ids[2], name: '维修', icon: 'http://www.crowdnear.com/m2/assets/images/ios/@2x/wx2@2x.png', sort: 50}),
    knex('t_service_type').insert({id: id(), categoryId: ids[2], name: '代购', icon: 'http://www.crowdnear.com/m2/assets/images/ios/@2x/dg2@2x.png', sort: 60}),
    knex('t_service_type').insert({id: id(), categoryId: ids[2], name: '托管', icon: 'http://www.crowdnear.com/m2/assets/images/ios/@2x/tg2@2x.png', sort: 70}),
    knex('t_service_type').insert({id: id(), categoryId: ids[2], name: '出借', icon: 'http://www.crowdnear.com/m2/assets/images/ios/@2x/cj2@2x.png', sort: 80}),
    knex('t_service_type').insert({id: id(), categoryId: ids[2], name: '折送', icon: 'http://www.crowdnear.com/m2/assets/images/ios/@2x/ph2@2x.png', sort: 90}),
    knex('t_service_type').insert({id: id(), categoryId: ids[2], name: '顺搭', icon: 'http://www.crowdnear.com/m2/assets/images/ios/@2x/fd2@2x.png', sort: 100}),
  ]);
};
