const jwt = require('jsonwebtoken');
const User = require('../models/user');
const MY_SECRET = 'mysecret';

const generateToken = user => {
  const timestamp = new Date().getTime();
  return jwt.sign({ sub: user.id, iat: timestamp }, MY_SECRET);
};

exports.signin = (req, res, next) => {
  res.status(200).send({ token: generateToken(req.user) });
};

exports.signup = async (req, res, next) => {
  const { email, password } = req.body;

  // validation
  if (!email || !password) {
    return res
      .status(422)
      .json({ error: 'You must provide email and password' });
  }

  // If user exists, return error
  const existingUser = await User.findOne({ email }).catch(next);
  if (existingUser) {
    return res.status(422).json({ error: 'Email is in use' });
  }

  // create a user and return created user's infomation
  const user = new User({
    email,
    password,
  });
  const createdUser = await user.save().catch(next);

  return res.json({ token: generateToken(createdUser) });
};
