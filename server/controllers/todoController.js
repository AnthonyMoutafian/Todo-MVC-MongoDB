class TodoController {
  async getTodos(req, res) {
    try {
      const user = await req.app.locals.services.todos.getTodos(
        res.locals.userId,
      );

      res.json({
        success: true,
        user: {
          name: user.name,
          email: user.email,
          avatar: user.avatar,
          todos: user.todos,
        },
      });
    } catch (err) {
      res.status(500).json({
        success: false,
        message: err.message,
      });
    }
  }

  async addTodo(req, res) {
    try {
      await req.app.locals.services.todos.addTodo(res.locals.userId, req.body);

      res.status(201).json({
        success: true,
        message: "Todo added",
      });
    } catch (err) {
      res.status(400).json({
        success: false,
        message: err.message,
      });
    }
  }

  async deleteTodo(req, res) {
    try {
      await req.app.locals.services.todos.deleteTodo(
        res.locals.userId,
        req.params.id,
      );

      res.json({
        success: true,
        message: "Todo deleted",
      });
    } catch (err) {
      res.status(400).json({
        success: false,
        message: err.message,
      });
    }
  }

  async doneTodo(req, res) {
    try {
      await req.app.locals.services.todos.doneTodo(
        res.locals.userId,
        req.params.id,
      );

      res.json({
        success: true,
        message: "Todo completed",
      });
    } catch (err) {
      res.status(400).json({
        success: false,
        message: err.message,
      });
    }
  }

  async editTodo(req, res) {
    try {
      await req.app.locals.services.todos.editTodo(
        res.locals.userId,
        req.params.id,
      );

      res.json({
        success: true,
        message: "Todo editing enabled",
      });
    } catch (err) {
      res.status(400).json({
        success: false,
        message: err.message,
      });
    }
  }

  async saveTodo(req, res) {
    try {
      await req.app.locals.services.todos.saveTodo(
        res.locals.userId,
        req.params.id,
        req.body,
      );

      res.json({
        success: true,
        message: "Todo saved",
      });
    } catch (err) {
      res.status(400).json({
        success: false,
        message: err.message,
      });
    }
  }

  async uploadTodoImage(req, res) {
    try {
      if (!req.file) {
        return res.status(400).json({
          success: false,
          message: "Please select an image.",
        });
      }

      const image = await req.app.locals.services.todos.uploadTodoImage(
        res.locals.userId,
        req.params.id,
        req.file,
      );

      res.json({
        success: true,
        message: "Image uploaded successfully.",
        image,
      });
    } catch (err) {
      res.status(400).json({
        success: false,
        message: err.message,
      });
    }
  }

  async deleteTodoImage(req, res) {
    try {
      await req.app.locals.services.todos.deleteTodoImage(
        res.locals.userId,
        req.params.id,
      );

      res.json({
        success: true,
        message: "Image deleted successfully.",
      });
    } catch (err) {
      res.status(400).json({
        success: false,
        message: err.message,
      });
    }
  }
}

module.exports.TodoController = TodoController;
