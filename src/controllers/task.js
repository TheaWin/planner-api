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

  async editTask(req, res) {
    try {
      const {
        taskName,
        taskDescription,
        dueDate,
        calendarName,
        priority,
        completed,
      } = req.body;

      const updatedTask = await task.findOneAndUpdate(
        { _id: req.params.taskId },
        {
          taskName,
          taskDescription,
          dueDate,
          calendarName,
          priority,
          completed,
        },
        { new: true }
      );

      if (!updatedTask) {
        return res.status(404).send('Task not found');
      }

      res.send(updatedTask);
    } catch (err) {
      res.status(500).send(err.message);
    }
  }

  async getTaskByCalendar(req, res) {
    try {
      const calendarName = req.params.calendarName;
      const foundTasks = await task.find({ calendarName });

      if (foundTasks.length > 0) {
        res.send(foundTasks);
      } else {
        res.status(404).send('Tasks not found');
      }
    } catch (err) {
      res.status(500).send(err.message);
    }
  }

  async getTaskByDate(req, res) {
    try {
      const dueDate = req.params.dueDate;
      if (!dueDate) {
        return res.status(400).send('Date is required');
      }

      const userTimezoneOffset = new Date().getTimezoneOffset() * 60000;
      const localDate = new Date(
        new Date(dueDate).getTime() - userTimezoneOffset
      );

      const startOfDayUTC = new Date(localDate.setHours(0, 0, 0, 0));
      const endOfDayUTC = new Date(localDate.setHours(23, 59, 59, 999));

      const tasks = await task.find({
        dueDate: {
          $gte: startOfDayUTC,
          $lt: endOfDayUTC,
        },
      });

      if (tasks.length > 0) {
        res.status(200).json(tasks);
      } else {
        res.status(404).send('No tasks found for the given date');
      }
    } catch (err) {
      res.status(500).send(err.message);
    }
  }

  async toggleTaskCompletion(req, res) {
    try {
      const taskId = req.params.taskId;
      const taskToUpdate = await task.findById(taskId);

      if (!taskToUpdate) {
        return res.status(404).send('Task not found');
      }

      const updatedTask = await task.findOneAndUpdate(
        { _id: taskId },
        { completed: !taskToUpdate.completed },
        { new: true }
      );

      res.send(updatedTask);
    } catch (err) {
      res.status(500).send(err.message);
    }
  }

  async deleteTask(req, res) {
    try {
      const deletedTask = await task.findOneAndDelete({
        _id: req.params.taskId,
      });

      if (!deletedTask) {
        return res.status(404).send('Task not found');
      }

      res.send('Task deleted');
    } catch (err) {
      res.status(500).send(err.message);
    }
  }
}

module.exports = TaskController;
