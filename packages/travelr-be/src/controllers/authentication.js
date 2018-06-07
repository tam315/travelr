const {
  DUMMY_TOKEN_FOR_TESTING,
  DUMMY_USER_ID_FOR_TESTING,
} = require('../dummies/dummies');

exports.checkToken = async (req, res, next) => {
  const token = req.header('authorization');

  if (!token) return res.status(401).send("missing 'authorization' header");

  // TODO: check token with firebase
  req.userId = 'ID_GET_FROM_FIREBASE';

  // if the test request is test purpose, set the dummy user ID
  if ('test' === process.env.NODE_ENV || token === DUMMY_TOKEN_FOR_TESTING) {
    req.userId = DUMMY_USER_ID_FOR_TESTING;
  }

  next();
};
