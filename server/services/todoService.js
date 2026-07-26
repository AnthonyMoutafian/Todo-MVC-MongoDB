const { ReadDBService } = require("./readDBService");
const mongoose = require("mongoose");
const googleDrive = require("./googleDriveService");

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

    const todo = currentUser.todos.find(
      (todo) => todo._id.toString() === todoId,
    );

    if (!todo) return;

    if (todo.image?.fileId) {
      await googleDrive.deleteFile(todo.image.fileId);
    }

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

  async uploadTodoImage(todoId, file) {
    const currentUser = await this.getCurrentUser();

    const uploaded = await googleDrive.uploadFile(
      file.path,
      file.filename,
      "todo",
    );

    await this.updateTodoImage(
      currentUser._id,
      new mongoose.Types.ObjectId(todoId),
      uploaded,
    );

    return uploaded;
  }

  async deleteTodoImage(todoId) {
    const currentUser = await this.getCurrentUser();

    const todo = currentUser.todos.id(todoId);

    if (!todo?.image) return;

    await googleDrive.deleteFile(todo.image.fileId);

    await this.updateTodoImage(currentUser._id, todo._id, null);
  }
}

module.exports.TodoService = TodoService;
