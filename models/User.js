const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
  name: String,
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  admin: Boolean,
  location: String,
  meta: {
    age: Number,
    website: String
  },
  created_at: Date,
  last_updated: Date
});

const User = mongoose.model('User', userSchema);

module.exports = User;
