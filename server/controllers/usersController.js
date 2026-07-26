const googleDrive = require("../services/googleDriveService");
const User = require("../models/userModel");

class UsersController {
  async getUsers(req, res) {
    try {
      const users = await req.app.locals.services.users.getUsers();

      res.json({
        success: true,
        users,
      });
    } catch (err) {
      res.status(500).json({
        success: false,
        message: err.message,
      });
    }
  }
}

module.exports.UsersController = UsersController;
