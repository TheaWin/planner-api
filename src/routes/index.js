const IndexController = require('../controllers/index');
const CalendarController = require('../controllers/calendar');

function setRoutes(app) {
  const indexController = new IndexController();
  const calendarController = new CalendarController();

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
}

module.exports = setRoutes;
