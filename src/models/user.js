const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  calendars: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'calendars',
    },
  ],
});
userSchema.statics.hashPassword = (password) => {
  return bcrypt.hashSync(password, 10);
};

module.exports = mongoose.model('User', userSchema);
