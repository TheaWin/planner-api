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

  async getTaskByName(req, res) {
    try {
      const taskName = req.params.taskName;

      if (!taskName || taskName.trim() === '') {
        return res.status(400).send('Task name is required');
      }

      const foundTasks = await task.find({
        taskName: { $regex: taskName, $options: 'i' },
      });

      if (foundTasks.length > 0) {
        res.status(200).json(foundTasks);
      } else {
        res.status(404).send('Task not found');
      }
    } catch (err) {
      res.status(500).send(err.message);
    }
  }

  async getTaskById(req, res) {
    try {
      const taskId = req.params.taskId;
      const foundTask = await task.findById(taskId);

      if (foundTask) {
        res.send(foundTask);
      } else {
        res.status(404).send('Task not found');
      }
    } catch (err) {
      res.status(500).send(err.message);
    }
  }
}

module.exports = TaskController;
