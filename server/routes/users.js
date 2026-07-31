const express = require("express");
const { UsersController } = require("../controllers/usersController");
const { checkAuth } = require("../middleware/checkAuth");

const usersRouter = express.Router();

const usersController = new UsersController();

usersRouter.get(
  "/users",
  checkAuth,
  usersController.getUsers
);

module.exports = usersRouter;