const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: String,
  email: String,
  password: String,
  wallet: { type: Number, default: 0 },
  referralCode: String,
  referredBy: String,
});

module.exports = mongoose.model('User', userSchema);
