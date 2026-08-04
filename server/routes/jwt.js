const express = require("express");
const router = express.Router();

router.post("/refresh", async (req, res) => {
  try {
    const refreshToken = req.cookies.refreshToken;

    if (!refreshToken) {
      return res.status(401).json({
        success: false,
        message: "No refresh token",
      });
    }

    const accessToken = await req.app.locals.services.auth.refreshAccessToken(
      req.cookies.refreshToken,
    );

    res.json({ accessToken });
  } catch {
    res.status(401).json({
      success: false,
    });
  }
});

module.exports = router;
