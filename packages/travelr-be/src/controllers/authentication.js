exports.checkToken = async (req, res, next) => {
  const token = req.header('authorization');

  if (!token) return res.status(401).send("missing 'authorization' header");

  // TODO: check token with firebase
  req.userId = 'ID_GET_FROM_FIREBASE';

  next();
};
