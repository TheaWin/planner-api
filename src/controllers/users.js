const user = require('../models/users');

class UserController {
  /**
   * Retrieves the details of the currently authenticated user.
   *
   * @param {Object} req - The request object.
   * @param {Object} req.user - The authenticated user object.
   * @param {string} req.user._id - The ID of the authenticated user.
   * @param {Object} res - The response object.
   * @returns {Promise<void>} - A promise that resolves when the user details are retrieved and sent in the response.
   * @throws {Error} - If an error occurs while retrieving the user details.
   */
  async getUserDetails(req, res) {
    try {
      const userDetails = await user
        .findById(req.user._id)
        .populate({ path: 'calendar', strictPopulate: false });
      if (!userDetails) {
        return res.status(404).send('User not found');
      }
      res.status(200).json(userDetails);
    } catch (error) {
      res.status(500).send(error.message);
    }
  }
}

module.exports = UserController;
