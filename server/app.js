require("dotenv").config();
var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
const mongoose = require("mongoose");
var indexRouter = require("./routes/index");
var usersRouter = require("./routes/users");
const { AuthServices } = require("./services/authService");
const authRouter = require("./routes/auth");
const { ReadDBService } = require("./services/readDBService");
const todoRouter = require("./routes/todo");
const { TodoService } = require("./services/todoService");
const userModel = require("./models/userModel");
const cors = require("cors");

var app = express();
mongoose
  .connect(
    "mongodb+srv://AnthonyMou:Ant2026@anthony.uftgglj.mongodb.net/Todo?appName=Anthony",
  )
  .then(() => {
    console.log("DB CONNECTED");
  });

app.locals.models = {
  users: userModel,
};

app.locals.services = {
  users: new ReadDBService(app.locals.models),
  auth: new AuthServices(app.locals.models),
  todos: new TodoService(app.locals.models),
};

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

const corsOptions = {
  origin: "http://localhost:5173",
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type"],
  credentials: true,
  allowedHeaders: ["Content-Type", "Authorization"],
};

app.use(cors(corsOptions));

app.use("/", indexRouter);
app.use("/api", usersRouter);
app.use("/api", authRouter);
app.use("/api/todo", todoRouter);

app.use(function (req, res, next) {
  next(createError(404));
});

app.use(function (err, req, res, next) {
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;
