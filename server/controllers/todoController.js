class TodoController {
  async getTodos(req, res) {
    try {
      const currentUser = await req.app.locals.services.users.getCurrentUser();

      if (!currentUser) {
        return res.status(401).json({
          success: false,
          message: "Not logged in",
        });
      }

      res.json({
        success: true,
        user: {
          name: currentUser.name,
          email: currentUser.email,
          avatar: currentUser.avatar || null,
          todos: currentUser.todos,
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
      await req.app.locals.services.todos.addTodo(req.body);

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
      await req.app.locals.services.todos.deleteTodo(req.params.id);

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
      await req.app.locals.services.todos.doneTodo(req.params.id);

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
      await req.app.locals.services.todos.editTodo(req.params.id);

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
      await req.app.locals.services.todos.saveTodo(req.params.id, req.body);

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
      await req.app.locals.services.todos.deleteTodoImage(req.params.id);

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
