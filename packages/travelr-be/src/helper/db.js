const mysql = require('promise-mysql');
const config = require('../../config');

const createPool = () => {
  const {
    connectionLimit,
    host,
    user,
    password,
    database,
  } = config.database.development;

  const pool = mysql.createPool({
    connectionLimit,
    host,
    user,
    password,
    database,
  });

  return pool;
};

const getQueryColumns = arg => {
  let targetObject = arg instanceof Array ? arg[0] : arg;

  const keys = Object.keys(targetObject)
    .toString()
    .replace("'", '');

  return keys;
};

const getQueryValues = array => {
  if (!array instanceof Array) return;

  const keys = Object.keys(array[0]);

  const bulkInsertArray = array.map(item => {
    const arr = [];
    for (let i = 0; i < keys.length; i += 1) {
      arr.push(item[keys[i]]);
    }
    return arr;
  });

  return bulkInsertArray;
};

module.exports = {
  createPool,
  getQueryColumns,
  getQueryValues,
};
