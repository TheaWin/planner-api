const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
  taskName: {
    type: String,
    required: true,
  },
  taskDescription: {
    type: String,
  },
  dueDate: {
    type: Date,
    default: Date.now,
  },
  createdDate: {
    type: Date,
    default: Date.now,
  },
  completed: {
    type: Boolean,
    default: false,
  },
  priority: {
    type: String,
    enum: [null, 'low', 'med', 'high'],
    default: null,
  },
  calendarName: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model('task', taskSchema);
