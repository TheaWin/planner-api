const calendar = require('../models/calendar');
const user = require('../models/users');

class CalendarController {
  /**
   * Creates a new calendar for the user.
   *
   * @param {Object} req - The request object.
   * @param {Object} req.body - The body of the request.
   * @param {string} req.body.calendarName - The name of the calendar to be created.
   * @param {Object} req.user - The user object.
   * @param {string} req.user.username - The username of the user.
   * @param {Object} res - The response object.
   * @returns {object} 201 - The calendar object if successfully created.
   * @returns {Error} 500 - Internal Server Error
   */
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

  /**
   * Retrieves all calendars from the database.
   *
   * @param {Object} req - The request object.
   * @param {Object} res - The response object.
   * @returns {Promise<void>} - A promise that resolves when the calendars are retrieved and sent.
   * @throws {Error} - If there is an error retrieving the calendars, a 500 status code and error message are sent.
   */
  async getAllCalendars(req, res) {
    try {
      const calendars = await calendar.find();
      res.send(calendars);
    } catch (err) {
      res.status(500).send(err.message);
    }
  }

  /**
   * Retrieves a calendar by its name.
   *
   * @param {Object} req - The request object.
   * @param {Object} req.params - The request parameters.
   * @param {string} req.params.calendarName - The name of the calendar to retrieve.
   * @param {Object} res - The response object.
   * @returns {object} 200 - The calendar object if found.
   * @returns {object} 404 - Error message if calendar object not found.
   * @returns {Error} 500 - Internal Server Error
   */
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

  /**
   * Edits the name of an existing calendar.
   *
   * @param {Object} req - The request object.
   * @param {Object} req.body - The body of the request.
   * @param {string} req.body.calendarName - The new name for the calendar.
   * @param {Object} req.params - The parameters of the request.
   * @param {string} req.params.calendarName - The current name of the calendar to be updated.
   * @param {Object} res - The response object.
   * @returns {object} 200 - Sends the updated calendar.
   * @returns {object} 400 - Error message if calendar name is not provided.
   * @returns {object} 404 - Error message if calendar not found.
   * @returns {Error} 500 - Internal Server Error
   */
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

  /**
   * Deletes a calendar by its name and removes its reference from the user's calendars.
   *
   * @param {Object} req - The request object.
   * @param {Object} req.params - The request parameters.
   * @param {string} req.params.calendarName - The name of the calendar to delete.
   * @param {Object} req.user - The authenticated user object.
   * @param {string} req.user._id - The ID of the authenticated user.
   * @param {Object} res - The response object.
   * @returns {object} 200 - Sends "Calendar deleted" if successful.
   * @returns {object} 404 - Error message if calendar not found.
   * @returns {Error} 500 - Internal Server Error
   */
  async deleteCalendar(req, res) {
    try {
      const deletedCalendar = await calendar.findOneAndDelete({
        calendarName: req.params.calendarName,
      });

      if (!deletedCalendar) {
        return res.status(404).send('Calendar not found');
      }

      await user.findByIdAndUpdate(
        req.user._id,
        { $pull: { calendars: deletedCalendar._id } },
        { new: true, useFindAndModify: false }
      );

      res.send('Calendar deleted');
    } catch (err) {
      res.status(500).send(err.message);
    }
  }
}

module.exports = CalendarController;
