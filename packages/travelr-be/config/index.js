let config = {
  apiUrl: 'http://localhost:3090/',
  database: {
    host: 'localhost',
    user: 'travelr',
    password: process.env.TRAVELR_DB_DEV_PASS,
    database: 'travelr',
  },
  SRID: 4326,
  firebaseCredential: {
    projectId: 'travelr-a75c4',
    clientEmail:
      'firebase-adminsdk-ppf67@travelr-a75c4.iam.gserviceaccount.com',
    private_key_id: '185f7ddf4f42777d74a6b023c3cd282628b7ed86',
    privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
  },
};

config = {
  ...config,
  apiUrl: 'https://travelr-api.yuuniworks.com/',
  database: {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DBNAME,
  },
};

module.exports = config;
