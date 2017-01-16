const mysql = require('mysql2/promise');

let pool = null;
let creating = false;

exports.pool = getPool = async function() {
  if (pool != null) {
    return pool;
  }

  if (creating) {
    return await new Promise(function(resolve) {
      const timer = setInterval(function() {
        if (!creating) {
          clearInterval(timer);
          resolve(pool);
        }
      }, 10);
    });
  }

  creating = true;
  pool = await mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: '1111aaaa',
    database: 'community',
  });
  creating = false;
  return pool;
}

exports.connection = getConnection = async function() {
  let pool = await getPool();
  return await pool.getConnection();
}

exports.execute = execute = async function() {
  let conn = arguments[0];
  let args = Array.prototype.slice.call(arguments, 1);
  if (!conn || typeof conn == 'string') {
    conn = await getConnection();
    args = Array.prototype.slice.call(arguments, 0);
  }
  return await conn.execute.apply(conn, args);
}

exports.query = query = async function() {
  let [results, fields] = await execute.apply(this, Array.prototype.slice.call(arguments, 0));
  return results;
}

exports.first = first = async function() {
  let results = await query.apply(this, Array.prototype.slice.call(arguments, 0))
  return results[0];
}
