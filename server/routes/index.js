const express = require("express");
const indexRouter = express.Router();

indexRouter.get("/", function (req, res) {
  res.render("index");
});

indexRouter.get("/register", function (req, res) {
  res.render("register");
});

indexRouter.get("/login", function (req, res) {
  res.render("login");
});

indexRouter.get("/todo", async (req, res) => {
  try {
    const currentUser = await req.app.locals.services.users.getCurrentUser();

    if (!currentUser) {
      return res.redirect("/login");
    }

    res.render("todo", {
      todos: currentUser.todos,
    });
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
});

module.exports = indexRouter;
