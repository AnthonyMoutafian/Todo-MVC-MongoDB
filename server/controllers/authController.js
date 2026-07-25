class AuthController {
  async registerUser(req, res) {
    try {
      const user = await req.app.locals.services.auth.registerUser(req.body);

      res.json({
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
}

module.exports.AuthController = AuthController;
