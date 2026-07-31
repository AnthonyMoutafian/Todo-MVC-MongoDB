const express = require("express");
const upload = require("../middleware/upload");
const { checkAuth } = require("../middleware/checkAuth");
const { TodoController } = require("../controllers/todoController");

const router = express.Router();

const controller = new TodoController();

router.use(checkAuth);

router.get("/", controller.getTodos);

router.post("/create", controller.addTodo);

router.post("/edit/:id", controller.editTodo);

router.post("/save/:id", controller.saveTodo);

router.post("/done/:id", controller.doneTodo);

router.post("/delete/:id", controller.deleteTodo);

router.put(
  "/:id/image",
  upload.single("image"),
  controller.uploadTodoImage
);

router.delete(
  "/:id/image",
  controller.deleteTodoImage
);

module.exports = router;