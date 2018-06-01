module.exports = {
  database: {
    development: {
      connectionLimit: 10,
      host: 'localhost',
      user: 'root',
      password: process.env.TRAVELR_DB_DEV_PASS,
      database: 'travelr',
    },
    production: {},
  },
};
