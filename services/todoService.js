const { ReadDBService } = require("./readDBService");
const { ObjectId } = require("mongodb");

class TodoService extends ReadDBService {
  async addTodo(body) {
    if (!body.todo || body.todo.trim() === "") return;

    const currentUser = await super.getCurrentUser();
    const userId = new ObjectId(currentUser._id);

    const newTodo = {
      _id: new ObjectId(),
      todo: body.todo.trim(),
      isChecked: false,
      isEditing: false,
    };

    await super.updateTodos(userId, {
      $push: {
        todos: newTodo,
      },
    });
  }

  async deleteTodo(todoId) {
    const currentUser = await super.getCurrentUser();
    const userId = new ObjectId(currentUser._id);

    await super.updateTodos(userId, {
      $pull: {
        todos: {
          _id: new ObjectId(todoId),
        },
      },
    });
  }

  async doneTodo(todoId) {
    const currentUser = await super.getCurrentUser();
    const userId = new ObjectId(currentUser._id);

    const db = await super.getDB();

    await db.collection("users").updateOne(
      {
        _id: userId,
        "todos._id": new ObjectId(todoId),
      },
      {
        $set: {
          "todos.$.isChecked": true,
        },
      },
    );

    await db.collection("currentUser").updateOne(
      {
        _id: userId,
        "todos._id": new ObjectId(todoId),
      },
      {
        $set: {
          "todos.$.isChecked": true,
        },
      },
    );
  }

  async editTodo(todoId) {
    const currentUser = await super.getCurrentUser();
    const userId = new ObjectId(currentUser._id);

    const db = await super.getDB();

    await db.collection("users").updateOne(
      {
        _id: userId,
        "todos._id": new ObjectId(todoId),
      },
      {
        $set: {
          "todos.$.isEditing": true,
        },
      },
    );

    await db.collection("currentUser").updateOne(
      {
        _id: userId,
        "todos._id": new ObjectId(todoId),
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

    const currentUser = await super.getCurrentUser();
    const userId = new ObjectId(currentUser._id);

    const db = await super.getDB();

    await db.collection("users").updateOne(
      {
        _id: userId,
        "todos._id": new ObjectId(todoId),
      },
      {
        $set: {
          "todos.$.todo": body.todo.trim(),
          "todos.$.isEditing": false,
        },
      },
    );

    await db.collection("currentUser").updateOne(
      {
        _id: userId,
        "todos._id": new ObjectId(todoId),
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
