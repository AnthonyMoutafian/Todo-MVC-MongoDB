class AuthController {
  async registerUser(req, res) {
    try {
      const user = await req.app.locals.services.auth.registerUser(req.body);

      res.status(201).json({
        success: true,
        message: "Registration successful",
        user,
      });
    } catch (err) {
      res.status(400).json({
        success: false,
        message: err.message,
      });
    }
  }

  async loginUser(req, res) {
    try {
      const user = await req.app.locals.services.auth.loginUser(req.body);

      res.json({
        success: true,
        message: "Login successful",
        user,
      });
    } catch (err) {
      res.status(400).json({
        success: false,
        message: err.message,
      });
    }
  }

  async logoutUser(req, res) {
    try {
      await req.app.locals.services.auth.logoutUser();

      res.json({
        success: true,
        message: "Logged out",
      });
    } catch (err) {
      res.status(400).json({
        success: false,
        message: err.message,
      });
    }
  }
  async uploadAvatar(req, res) {
    try {
      if (!req.file) {
        return res.status(400).json({
          success: false,
          message: "No image uploaded",
        });
      }

      console.log(req.file);

      const avatar = await req.app.locals.services.auth.uploadAvatar(req.file);

      res.json({
        success: true,
        avatar,
      });
    } catch (err) {
      console.log(err);

      res.status(400).json({
        success: false,
        message: err.message,
      });
    }
  }

  async deleteAvatar(req, res) {
    try {
      await req.app.locals.services.auth.deleteAvatar();

      res.json({
        success: true,
        message: "Avatar deleted",
      });
    } catch (err) {
      res.status(400).json({
        success: false,
        message: err.message,
      });
    }
  }
}

module.exports.AuthController = AuthController;
