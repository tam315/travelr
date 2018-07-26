let config = {
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
  firebaseCredential: {
    projectId: 'travelr-a75c4',
    clientEmail:
      'firebase-adminsdk-ppf67@travelr-a75c4.iam.gserviceaccount.com',
    private_key_id: '584e94eb61ef32affc4e6b5bc434b30690f000f4',
    privateKey: JSON.parse(process.env.FIREBASE_PRIVATE_KEY),
  },
};

if (process.env.NODE_ENV === 'production') {
  config = {
    ...config,
    database: {
      development: {
        host: 'postgres-svc',
        user: 'travelr',
        password: process.env.POSTGRES_TRAVELR_PASS,
        database: 'travelr',
      },
      production: {},
    },
  };
}

module.exports = config;
