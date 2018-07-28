const pgPromise = require('pg-promise')();

const config = require('../../config');

const { host, user, password, database } = config.database;

const db = pgPromise({
  host,
  user,
  password,
  database,
});

module.exports = { db };
