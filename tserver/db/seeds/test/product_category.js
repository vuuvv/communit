var uuid = require('uuid/v4');

exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries
  return Promise.all([
    // Inserts seed entries
    knex('t_product_category').insert({id: uuid(), name: '美食', icon: 'http://www.crowdnear.com/m2/assets/images/ios/@2x/ms@2x.png'}),
    knex('t_product_category').insert({id: uuid(), name: '丽人', icon: 'http://www.crowdnear.com/m2/assets/images/ios/@2x/lr@2x.png'}),
    knex('t_product_category').insert({id: uuid(), name: '爱车', icon: 'http://www.crowdnear.com/m2/assets/images/ios/@2x/ac@2x.png'}),
    knex('t_product_category').insert({id: uuid(), name: '购物', icon: 'http://www.crowdnear.com/m2/assets/images/ios/@2x/gw@2x.png'}),
    knex('t_product_category').insert({id: uuid(), name: '亲子', icon: 'http://www.crowdnear.com/m2/assets/images/ios/@2x/qz@2x.png'}),
    knex('t_product_category').insert({id: uuid(), name: '酒店', icon: 'http://www.crowdnear.com/m2/assets/images/ios/@2x/jd@2x.png'}),
    knex('t_product_category').insert({id: uuid(), name: '生活服务', icon: 'http://www.crowdnear.com/m2/assets/images/ios/@2x/shfw@2x.png'}),
    knex('t_product_category').insert({id: uuid(), name: '休闲娱乐', icon: 'http://www.crowdnear.com/m2/assets/images/ios/@2x/xxyl@2x.png'}),
    knex('t_product_category').insert({id: uuid(), name: '运动健身', icon: 'http://www.crowdnear.com/m2/assets/images/ios/@2x/ydjs@2x.png'}),
    knex('t_product_category').insert({id: uuid(), name: '学习培训', icon: 'http://www.crowdnear.com/m2/assets/images/ios/@2x/xxpx@2x.png'}),
  ]);
};
