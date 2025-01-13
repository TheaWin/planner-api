// filepath: src/routes/index.js
const IndexController = require('../controllers/index');
const CalendarController = require('../controllers/calendar');
const TaskController = require('../controllers/task');
const passport = require('passport');

function setRoutes(app) {
  const indexController = new IndexController();
  const calendarController = new CalendarController();
  const taskController = new TaskController();

  app.get('/', indexController.getIndex.bind(indexController));

  app.post(
    '/calendars',
    passport.authenticate('jwt', { session: false }),
    calendarController.createCalendar.bind(calendarController)
  );
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
}

module.exports = setRoutes;
