const mongoose = require('mongoose');

const calendarSchema = new mongoose.Schema({
  calendarName: {
    type: String,
    required: true,
  },
  createdDate: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('calendar', calendarSchema);
