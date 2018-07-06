const config = require('../../config');
const firebaseAdmin = require('firebase-admin');

firebaseAdmin.initializeApp({
  credential: firebaseAdmin.credential.cert(config.firebaseCredential),
});

const { DUMMY_TOKEN, DUMMY_USER_ID } = require('../dummies/dummies');

exports.checkToken = async (req, res, next) => {
  const token = req.header('authorization');

  if (!token) return res.status(401).send("missing 'authorization' header");

  try {
    // if the test request is test purpose, set the dummy user ID
    if (process.env.NODE_ENV === 'test' && token === DUMMY_TOKEN) {
      req.userId = DUMMY_USER_ID;
      if (!req.userId) return res.status(401).send('authorization failed');
      return next();
    }
    const result = await firebaseAdmin.auth().verifyIdToken(token);
    const firebaseUserId = result.user_id;

    if (!firebaseUserId) return res.status(401).send('firebase user not found');

    req.userId = firebaseUserId;

    return next();
  } catch (err) {
    return res.status(400).send(err);
  }
};
