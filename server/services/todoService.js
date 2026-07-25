const { ReadDBService } = require("./readDBService");
const mongoose = require("mongoose");

class TodoService extends ReadDBService {
  constructor(models) {
    super(models);
  }

  async addTodo(body) {
    if (!body.todo || body.todo.trim() === "") return;

    const currentUser = await this.getCurrentUser();

    if (!currentUser) return;

    const newTodo = {
      _id: new mongoose.Types.ObjectId(),
      todo: body.todo.trim(),
      isChecked: false,
      isEditing: false,
    };

    await this.updateTodos(currentUser._id, {
      $push: {
        todos: newTodo,
      },
    });
  }

  async deleteTodo(todoId) {
    const currentUser = await this.getCurrentUser();

    if (!currentUser) return;

    await this.updateTodos(currentUser._id, {
      $pull: {
        todos: {
          _id: new mongoose.Types.ObjectId(todoId),
        },
      },
    });
  }

  async doneTodo(todoId) {
    const currentUser = await this.getCurrentUser();

    if (!currentUser) return;

    await this.updateUserAndCurrentUser(
      {
        _id: currentUser._id,
        "todos._id": new mongoose.Types.ObjectId(todoId),
      },
      {
        $set: {
          "todos.$.isChecked": true,
          "todos.$.isEditing": false,
        },
      },
    );
  }

  async editTodo(todoId) {
    const currentUser = await this.getCurrentUser();

    if (!currentUser) return;

    await this.updateUserAndCurrentUser(
      {
        _id: currentUser._id,
        "todos._id": new mongoose.Types.ObjectId(todoId),
      },
      {
        $set: {
          "todos.$.isEditing": true,
        },
      },
    );
  }

  async saveTodo(todoId, body) {
    if (!body.todo || body.todo.trim() === "") return;

    const currentUser = await this.getCurrentUser();

    if (!currentUser) return;

    await this.updateUserAndCurrentUser(
      {
        _id: currentUser._id,
        "todos._id": new mongoose.Types.ObjectId(todoId),
      },
      {
        $set: {
          "todos.$.todo": body.todo.trim(),
          "todos.$.isEditing": false,
        },
      },
    );
  }
}

module.exports.TodoService = TodoService;
