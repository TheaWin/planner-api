const CalendarController = require('../controllers/calendar');
const TaskController = require('../controllers/task');
const UserController = require('../controllers/users');
const passport = require('passport');

function setRoutes(app) {
  const calendarController = new CalendarController();
  const taskController = new TaskController();
  const userController = new UserController();

  app.get(
    '/calendars',
    passport.authenticate('jwt', { session: false }),
    calendarController.getAllCalendars.bind(calendarController)
  );
  app.get(
    '/calendars/:calendarName',
    passport.authenticate('jwt', { session: false }),
    calendarController.getCalendar.bind(calendarController)
  );
  app.put(
    '/calendars/:calendarName',
    passport.authenticate('jwt', { session: false }),
    calendarController.editCalendar.bind(calendarController)
  );
  app.delete(
    '/calendars/:calendarName',
    passport.authenticate('jwt', { session: false }),
    calendarController.deleteCalendar.bind(calendarController)
  );

  app.post(
    '/tasks',
    passport.authenticate('jwt', { session: false }),
    taskController.createTask.bind(taskController)
  );
  app.get(
    '/tasks',
    passport.authenticate('jwt', { session: false }),
    taskController.getAllTasks.bind(taskController)
  );
  app.get(
    '/tasks/namesearch/:taskName',
    passport.authenticate('jwt', { session: false }),
    taskController.getTaskByName.bind(taskController)
  );
  app.get(
    '/tasks/idsearch/:taskId',
    passport.authenticate('jwt', { session: false }),
    taskController.getTaskById.bind(taskController)
  );
  app.put(
    '/tasks/:taskId',
    passport.authenticate('jwt', { session: false }),
    taskController.editTask.bind(taskController)
  );
  app.get(
    '/tasks/:calendarName',
    passport.authenticate('jwt', { session: false }),
    taskController.getTaskByCalendar.bind(taskController)
  );
  app.get(
    '/tasks/date/:dueDate',
    passport.authenticate('jwt', { session: false }),
    taskController.getTaskByDate.bind(taskController)
  );
  app.patch(
    '/tasks/:taskId',
    passport.authenticate('jwt', { session: false }),
    taskController.toggleTaskCompletion.bind(taskController)
  );
  app.delete(
    '/tasks/:taskId',
    passport.authenticate('jwt', { session: false }),
    taskController.deleteTask.bind(taskController)
  );

  app.get(
    '/users',
    passport.authenticate('jwt', { session: false }),
    userController.getUserDetails.bind(userController)
  );
  app.delete(
    '/users/calendars/:calendarId',
    passport.authenticate('jwt', { session: false }),
    userController.deleteCalendar.bind(userController)
  );
}

module.exports = setRoutes;
