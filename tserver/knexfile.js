// Update with your config settings.

module.exports = {

  development: {
    client: 'mysql',
    connection: {
      host: '127.0.0.1',
      user: 'root',
      password: '1111aaaa',
      database: 'community',
      charset: 'utf8mb4'
    },
    migrations: {
      directory: __dirname + '/db/migrations'
    },
    seeds: {
      directory: __dirname + '/db/seeds/test'
    }
  },

  staging: {
    client: 'mysql',
    connection: {
      host: '127.0.0.1',
      user: 'root',
      password: '1111aaaa',
      database: 'community',
      charset: 'utf8mb4'
    },
    migrations: {
      directory: __dirname + '/db/migrations'
    },
    seeds: {
      directory: __dirname + '/db/seeds/test'
    }
  },

  production: {
    client: 'mysql',
    connection: {
      host: '127.0.0.1',
      user: 'root',
      password: '1111aaaa',
      database: 'community',
      charset: 'utf8mb4'
    },
    migrations: {
      directory: __dirname + '/db/migrations'
    },
    seeds: {
      directory: __dirname + '/db/seeds/test'
    }
  }
};
