const task = require('../models/task');

class TaskController {
  /**
   * Creates a new task.
   *
   * @param {Object} req - The request object.
   * @param {Object} req.body - The request body.
   * @param {string} req.body.taskName - The name of the task.
   * @param {string} [req.body.taskDescription] - The description of the task.
   * @param {string} [req.body.dueDate] - The due date of the task.
   * @param {string} req.body.calendarName - The name of the calendar.
   * @param {string} [req.body.priority] - The priority of the task.
   * @param {Object} res - The response object.
   * @returns {Promise<void>} - A promise that resolves when the task is created.
   */
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

  /**
   * Retrieves all tasks from the database.
   *
   * @param {Object} req - The request object.
   * @param {Object} res - The response object.
   * @returns {Promise<void>} - A promise that resolves when the tasks are retrieved and sent.
   * @throws {Error} - If there is an error retrieving the tasks, a 500 status code and error message are sent.
   */
  async getAllTasks(req, res) {
    try {
      const tasks = await task.find();
      res.send(tasks);
    } catch (err) {
      res.status(500).send(err.message);
    }
  }

  /**
   * Retrieves tasks by their complete or partial name.
   *
   * @param {Object} req - The request object.
   * @param {Object} req.params - The parameters from the request.
   * @param {string} req.params.taskName - The name of the task to search for.
   * @param {Object} res - The response object.
   * @returns {object} 200 - The task object if found.
   * @returns {object} 400 - Error message if task name is missing.
   * @returns {object} 404 - Error message if task not found.
   * @returns {Error} 500 - Internal Server Error
   */
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

  /**
   * Retrieves a task by its ID.
   *
   * @param {Object} req - The request object.
   * @param {Object} req.params - The parameters of the request.
   * @param {string} req.params.taskId - The ID of the task to retrieve.
   * @param {Object} res - The response object.
   * @returns {object} 200 - The task object if found.
   * @returns {object} 404 - Error message if task object not found.
   * @returns {Error} 500 - Internal Server Error
   */
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

  /**
   * Edit an existing task.
   *
   * @param {Object} req - The request object.
   * @param {Object} req.body - The request body.
   * @param {string} req.body.taskName - The name of the task.
   * @param {string} req.body.taskDescription - The description of the task.
   * @param {string} req.body.dueDate - The due date of the task.
   * @param {string} req.body.calendarName - The name of the calendar.
   * @param {string} req.body.priority - The priority of the task.
   * @param {boolean} req.body.completed - The completion status of the task.
   * @param {Object} req.params - The request parameters.
   * @param {string} req.params.taskId - The ID of the task to be edited.
   * @param {Object} res - The response object.
   * @returns {object} 200 - The updated task object if successfully edited.
   * @returns {object} 404 - Error message if task object not found.
   * @returns {Error} 500 - Internal Server Error
   */
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

  /**
   * Retrieves tasks by calendar name.
   *
   * @param {Object} req - The request object.
   * @param {Object} req.params - The parameters from the request.
   * @param {string} req.params.calendarName - The name of the calendar to find tasks for.
   * @param {Object} res - The response object.
   * @returns {object} 200 - The task object if found.
   * @returns {object} 404 - Error message if tasks not found.
   * @returns {Error} 500 - Internal Server Error
   * @throws {Error} - If an error occurs while retrieving the tasks.
   */
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

  /**
   * Retrieves tasks by a specific due date.
   *
   * @param {Object} req - The request object.
   * @param {Object} req.params - The request parameters.
   * @param {string} req.params.dueDate - The due date to filter tasks by.
   * @param {Object} res - The response object.
   * @returns {object} 200 - Returns all tasks for requested due date.
   * @returns {object} 400 - Error message if due date is missing.
   * @returns {object} 404 - Error message if there is no tasks found.
   * @returns {Error} 500 - Internal Server Error
   * @throws {Error} - If an error occurs while retrieving tasks.
   */
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

  /**
   * Retrieves tasks for a given week based on the provided due date.
   *
   * @param {Object} req - The request object.
   * @param {Object} req.params - The request parameters.
   * @param {string} req.params.dueDate - The due date to find tasks for the week.
   * @param {Object} res - The response object.
   * @returns {object} 200 - Returns all the tasks object from a given week based on the due date.
   * @returns {object} 400 - Error message if due date is missing.
   * @returns {object} 404 - Error message if no tasks found.
   * @returns {Error} 500 - Internal Server Error
   * @throws {Error} - If an error occurs while retrieving tasks.
   */
  async getTaskByWeek(req, res) {
    try {
      const dueDate = req.params.dueDate;
      if (!dueDate) {
        return res.status(400).send('Date is required');
      }

      const userTimezoneOffset = new Date().getTimezoneOffset() * 60000;
      const localDueDate = new Date(
        new Date(dueDate).getTime() - userTimezoneOffset
      );

      const dayOfWeek = localDueDate.getUTCDay();
      const diffToMonday = (dayOfWeek === 0 ? -6 : 1) - dayOfWeek;
      const startOfWeekUTC = new Date(localDueDate);
      startOfWeekUTC.setUTCDate(localDueDate.getUTCDate() + diffToMonday);
      startOfWeekUTC.setUTCHours(0, 0, 0, 0);

      const endOfWeekUTC = new Date(startOfWeekUTC);
      endOfWeekUTC.setUTCDate(startOfWeekUTC.getUTCDate() + 6);
      endOfWeekUTC.setUTCHours(23, 59, 59, 999);

      const tasks = await task.find({
        dueDate: {
          $gte: startOfWeekUTC,
          $lt: endOfWeekUTC,
        },
      });

      if (tasks.length > 0) {
        res.status(200).json(tasks);
      } else {
        res.status(404).send('No tasks found for the given week');
      }
    } catch (err) {
      res.status(500).send(err.message);
    }
  }

  /**
   * Toggles the completion status of a task.
   *
   * @param {Object} req - The request object.
   * @param {Object} req.params - The parameters of the request.
   * @param {string} req.params.taskId - The ID of the task to toggle.
   * @param {Object} res - The response object.
   * @returns {object} 200 - Returns true or false based on initial value.
   * @returns {object} 404 - Error message if task not found.
   * @returns {Error} 500 - Internal Server Error
   */
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

  /**
   * Deletes a task based on the provided task ID.
   *
   * @param {Object} req - The request object.
   * @param {Object} req.params - The parameters of the request.
   * @param {string} req.params.taskId - The ID of the task to be deleted.
   * @param {Object} res - The response object.
   * @returns {Promise<void>} - A promise that resolves when the task is deleted.
   */
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
