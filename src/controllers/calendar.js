const uuid = require('uuid');
const calendarDatabase = require('../db/calendarDatabase');

class CalendarController {
  createCalendar(req, res) {
    let newCalendar = req.body;

    if (!newCalendar.calendarName) {
      return res.status(400).send('Calendar name is required');
    } else {
      newCalendar.calendarId = uuid.v4();
      newCalendar.createdDate = new Date().toISOString();
      calendarDatabase.push(newCalendar);
      res.status(201).send(newCalendar);
    }
  }

  getCalendars(req, res) {
    res.send(calendarDatabase);
  }
}

module.exports = CalendarController;
