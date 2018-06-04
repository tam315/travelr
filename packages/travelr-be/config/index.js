module.exports = {
  database: {
    development: {
      host: 'localhost',
      user: 'travelr',
      password: process.env.TRAVELR_DB_DEV_PASS,
      database: 'travelr',
    },
    production: {},
  },
  SRID: 4326,
};
