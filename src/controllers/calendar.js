const uuid = require('uuid');
const calendar = require('../models/calendar');
const user = require('../models/user');

class CalendarController {
  async createCalendar(req, res) {
    const { calendarName } = req.body;

    if (!calendarName) {
      return res.status(400).send('Calendar name is required');
    }

    try {
      const newCalendar = await calendar.create({
        calendarName,
        user: req.user.username,
      });

      await user.findOneAndUpdate(
        req.user.username,
        { $push: { calendars: newCalendar._id } },
        { new: true, useFindAndModify: false }
      );

      res.status(201).send(newCalendar);
    } catch (error) {
      res.status(500).send(error.message);
    }
  }

  async getAllCalendars(req, res) {
    try {
      const calendars = await calendar.find();
      res.send(calendars);
    } catch (err) {
      res.status(500).send(err.message);
    }
  }

  async getCalendar(req, res) {
    try {
      const foundCalendar = await calendar.findOne({
        calendarName: req.params.calendarName,
      });

      if (foundCalendar) {
        res.send(foundCalendar);
      } else {
        res.status(404).send('Calendar not found');
      }
    } catch (err) {
      res.status(500).send(err.message);
    }
  }

  async editCalendar(req, res) {
    try {
      const { calendarName: newCalendarName } = req.body;

      if (!newCalendarName) {
        return res.status(400).send('New calendar name is required');
      }

      const updatedCalendar = await calendar.findOneAndUpdate(
        { calendarName: req.params.calendarName },
        { calendarName: newCalendarName },
        { new: true }
      );

      if (!updatedCalendar) {
        return res.status(404).send('Calendar not found');
      }

      res.send(updatedCalendar);
    } catch (err) {
      res.status(500).send(err.message);
    }
  }

  async deleteCalendar(req, res) {
    try {
      const deletedCalendar = await calendar.findOneAndDelete({
        calendarName: req.params.calendarName,
      });

      if (!deletedCalendar) {
        return res.status(404).send('Calendar not found');
      }

      res.send('Calendar deleted');
    } catch (err) {
      res.status(500).send(err.message);
    }
  }
}

module.exports = CalendarController;
