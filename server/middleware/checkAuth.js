const jwt = require("jsonwebtoken");

const checkAuth = (req, res, next) => {
  try {
    const token = (req.headers.authorization || "").replace(/^Bearer\s/, "");

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    const decoded = jwt.verify(token, process.env.ACCESS_SECRET);

    res.locals.userId = decoded.id;

    next();
  } catch (err) {
    return res.status(401).json({
      success: false,
      message: "Invalid token",
    });
  }
};

module.exports.checkAuth = checkAuth;
