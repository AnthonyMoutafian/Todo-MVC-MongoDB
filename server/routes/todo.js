const express = require("express");
const upload = require("../middleware/upload");
const router = express.Router();

const { TodoController } = require("../controllers/todoController");

const controller = new TodoController();

router.get("/", controller.getTodos);

router.post("/create", controller.addTodo);

router.post("/edit/:id", controller.editTodo);

router.post("/save/:id", controller.saveTodo);

router.post("/done/:id", controller.doneTodo);

router.post("/delete/:id", controller.deleteTodo);

router.put(
  "/:id/image",
  upload.single("image"),
  controller.uploadTodoImage,
);

router.delete("/:id/image", controller.deleteTodoImage);

module.exports = router;
