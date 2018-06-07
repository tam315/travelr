const DUMMY_ID_FOR_TESTING = 'DUMMY_ID_FOR_TESTING';
const DUMMY_HEADER_FOR_TESTING = 'DUMMY_HEADER_FOR_TESTING';
const DUMMY_TOKEN_FOR_TESTING = 'DUMMY_TOKEN_FOR_TESTING';

exports.checkToken = async (req, res, next) => {
  const token = req.header('authorization');

  if (!token) return res.status(401).send("missing 'authorization' header");

  // TODO: check token with firebase
  req.userId = 'ID_GET_FROM_FIREBASE';

  // if the test request is test purpose, set the dummy user ID
  if (req.header(DUMMY_HEADER_FOR_TESTING)) req.userId = DUMMY_ID_FOR_TESTING;
  next();
};

exports.DUMMY_ID_FOR_TESTING = DUMMY_ID_FOR_TESTING;
exports.DUMMY_HEADER_FOR_TESTING = DUMMY_HEADER_FOR_TESTING;
exports.DUMMY_TOKEN_FOR_TESTING = DUMMY_TOKEN_FOR_TESTING;
