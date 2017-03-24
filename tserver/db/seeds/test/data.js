var uuid = require('uuid/v4');

function id() {
return uuid().replace(/-/g, '');
}

exports.seed = function(knex, Promise) {
  return Promise.all([
    knex('t_biotope').insert({id: id(), name: '丰泽新村', communityId: 'cfa4e07d37b84fb19a5487d5a8e4f8b'}),
    knex('t_biotope').insert({id: id(), name: '丰泽社区', communityId: 'cfa4e07d37b84fb19a5487d5a8e4f8b'}),
    knex('t_biotope').insert({id: id(), name: '丰泽新村花苑', communityId: 'cfa4e07d37b84fb19a5487d5a8e4f8b'}),
  ]);
};
