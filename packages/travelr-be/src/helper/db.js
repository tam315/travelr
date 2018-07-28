const pgPromise = require('pg-promise')();

const config = require('../../config');

const { host, user, password, database } = config.database;

/*
 * prevent `pg-promise` from returning dates as a datetime
 * e.g. 2018-01-01 => 2017-12-31T15:00:00
 *
 * this code tells pg-promise to return the date as a simple string.
 *
 * see:
 * https://github.com/brianc/node-postgres/issues/510#issuecomment-33160960
 * https://github.com/vitaly-t/pg-promise/wiki/FAQ#how-to-access-the-instance-of-node-postgres-thats-used
 */
const { types } = pgPromise.pg;
types.setTypeParser(1082, 'text', val => val);

const db = pgPromise({
  host,
  user,
  password,
  database,
});

module.exports = { db };
