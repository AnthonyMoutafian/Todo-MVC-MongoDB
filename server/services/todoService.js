const { ReadDBService } = require("./readDBService");
const mongoose = require("mongoose");
const googleDrive = require("./googleDriveService");

class TodoService extends ReadDBService {
  constructor(models) {
    super(models);
  }

  async getTodos(userId) {
    const user = await this.getUserById(userId);

    if (!user) {
      throw new Error("User not found");
    }

    return user;
  }

  async addTodo(userId, body) {
    if (!body.todo || body.todo.trim() === "") return;

    const newTodo = {
      _id: new mongoose.Types.ObjectId(),
      todo: body.todo.trim(),
      isChecked: false,
      isEditing: false,
    };

    await this.updateTodos(userId, {
      $push: {
        todos: newTodo,
      },
    });
  }

  async deleteTodo(userId, todoId) {
    const user = await this.getUserById(userId);

    if (!user) return;

    const todo = user.todos.find((todo) => todo._id.toString() === todoId);

    if (!todo) return;

    if (todo.image?.fileId) {
      await googleDrive.deleteFile(todo.image.fileId);
    }

    await this.updateTodos(userId, {
      $pull: {
        todos: {
          _id: new mongoose.Types.ObjectId(todoId),
        },
      },
    });
  }

  async doneTodo(userId, todoId) {
    await this.updateUser(
      {
        _id: userId,
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

  async editTodo(userId, todoId) {
    await this.updateUser(
      {
        _id: userId,
        "todos._id": new mongoose.Types.ObjectId(todoId),
      },
      {
        $set: {
          "todos.$.isEditing": true,
        },
      },
    );
  }

  async saveTodo(userId, todoId, body) {
    if (!body.todo || body.todo.trim() === "") return;

    await this.updateUser(
      {
        _id: userId,
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

  async uploadTodoImage(userId, todoId, file) {
    const uploaded = await googleDrive.uploadFile(
      file.path,
      file.filename,
      "todo",
    );

    await this.updateTodoImage(
      userId,
      new mongoose.Types.ObjectId(todoId),
      uploaded,
    );

    return uploaded;
  }

  async deleteTodoImage(userId, todoId) {
    const user = await this.getUserById(userId);

    if (!user) return;

    const todo = user.todos.id(todoId);

    if (!todo?.image) return;

    await googleDrive.deleteFile(todo.image.fileId);

    await this.updateTodoImage(userId, todo._id, null);
  }
}

module.exports.TodoService = TodoService;
