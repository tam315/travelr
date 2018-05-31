const passport = require('passport');
const User = require('../models/user');
const MY_SECRET = 'mysecret';
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const LocalStrategy = require('passport-local');

const localOptions = { usernameField: 'email' };

const localStrategy = new LocalStrategy(
  localOptions,
  async (email, password, done) => {
    const user = await User.findOne({ email }).catch(done);
    // 検索成功、ユーザなし
    if (!user) return done();

    await user.comparePassword(password, (err, isMatch) => {
      if (err) return done(err);
      if (!isMatch) return done();
      done(null, user);
    });
  },
);

const jwtOptions = {
  jwtFromRequest: ExtractJwt.fromHeader('authorization'),
  secretOrKey: MY_SECRET,
};

const jwtStrategy = new JwtStrategy(jwtOptions, async (payload, done) => {
  const user = await User.findById(payload.sub)
    .exec()
    // 検索失敗
    .catch(done);

  // 検索成功、ユーザあり
  if (user) done(null, user);
  // 検索成功、ユーザなし
  else done();
});

passport.use(localStrategy);
passport.use(jwtStrategy);
