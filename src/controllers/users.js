const user = require('../models/users');

class UserController {
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
