const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

// define schema
const userSchema = new mongoose.Schema({
  email: { type: String, unique: true, lowercase: true },
  password: String,
});

// encrypt password on save
userSchema.pre('save', async function(next) {
  const user = this;

  const saltRounds = 10;
  const hash = await bcrypt.hash(user.password, saltRounds).catch(next);

  user.password = hash;
  next();
});

userSchema.methods.comparePassword = async function(
  plaintextPassword,
  callback,
) {
  const isMatch = await bcrypt
    .compare(plaintextPassword, this.password)
    .catch(callback);

  callback(null, isMatch);
};

const UserModelClass = mongoose.model('user', userSchema);

module.exports = UserModelClass;
