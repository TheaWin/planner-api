const IndexController = require('../controllers/index');
const CalendarController = require('../controllers/calendar');
const TaskController = require('../controllers/task');

function setRoutes(app) {
  const indexController = new IndexController();
  const calendarController = new CalendarController();
  const taskController = new TaskController();

  app.get('/', indexController.getIndex.bind(indexController));

  app.post(
    '/calendars',
    calendarController.createCalendar.bind(calendarController)
  );
  app.get(
    '/calendars',
    calendarController.getAllCalendars.bind(calendarController)
  );
  app.get(
    '/calendars/:calendarName',
    calendarController.getCalendar.bind(calendarController)
  );
  app.put(
    '/calendars/:calendarName',
    calendarController.editCalendar.bind(calendarController)
  );
  app.delete(
    '/calendars/:calendarName',
    calendarController.deleteCalendar.bind(calendarController)
  );

  app.post('/tasks', taskController.createTask.bind(taskController));
}

module.exports = setRoutes;
