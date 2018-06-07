const pgPromise = require('pg-promise')();

const config = require('../../config');

const { host, user, password, database } = config.database.development;

const db = pgPromise({
  host,
  user,
  password,
  database,
});

// a function to shut down all connections (for jest)
const shutdown = pgPromise.end;

module.exports = {
  db,
  shutdown,
};
