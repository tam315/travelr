const { DUMMY_TOKEN, DUMMY_USER_ID } = require('../dummies/dummies');

exports.checkToken = async (req, res, next) => {
  const token = req.header('authorization');

  if (!token) return res.status(401).send("missing 'authorization' header");

  // TODO: check token with firebase

  // if the test request is test purpose, set the dummy user ID
  if ('test' === process.env.NODE_ENV || token === DUMMY_TOKEN) {
    req.userId = 'DUMMY_USER_ID';
  } else {
    return res.status(401).send('authorization failed');
  }

  next();
};
