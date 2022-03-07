const Pool = require('pg').Pool;
const pool = new Pool({
  user: 'racitsolution',
  host: 'localhost',
  port: 5432,
  database: 'auth',
});

module.exports = pool;

// psql -U rabdeep -d auth 