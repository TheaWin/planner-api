const uuid = require('uuid');
const task = require('../models/task');

class TaskController {
  async createTask(req, res) {
    const {
      taskName,
      taskDescription,
      dueDate: reqDueDate,
      calendarName,
      priority,
    } = req.body;
    const dueDate = reqDueDate || new Date();

    if (!taskName) {
      return res.status(400).send('Task name is required');
    }
    if (!calendarName) {
      return res.status(400).send('Calendar name is required');
    }

    try {
      const newTask = await task.create({
        taskName,
        taskDescription,
        dueDate,
        calendarName,
        priority,
      });
      res.status(201).send(newTask);
    } catch (error) {
      res.status(500).send(error.message);
    }
  }

  async getAllTasks(req, res) {
    try {
      const tasks = await task.find();
      res.send(tasks);
    } catch (err) {
      res.status(500).send(err.message);
    }
  }
}

module.exports = TaskController;
