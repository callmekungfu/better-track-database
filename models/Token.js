const mongoose = require('mongoose');

const { Schema } = mongoose;

const loginTokenSchema = new Schema({
    token: { type: String, required: true, unique: true },
    timestamp: Date
});

const LoginToken = mongoose.model('LoginToken', loginTokenSchema);

module.exports = LoginToken;
