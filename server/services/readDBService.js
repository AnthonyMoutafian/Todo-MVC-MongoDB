const mongoose = require("mongoose");

class ReadDBService {
  constructor(models) {
    this.models = models;
  }

  async getUsers() {
    return await this.models.users.find();
  }

  async updateUser(filter, update) {
    const userResult = await this.models.users.updateOne(filter, update);

    return userResult;
  }

  async updateTodos(userId, update) {
    await this.updateUser(
      {
        _id: userId,
      },
      update,
    );
  }

  async getUserById(userId) {
    return await this.models.users.findById(userId);
  }

  async updateAvatar(userId, avatar) {
    return this.updateUser(
      { _id: userId },
      {
        $set: {
          avatar,
        },
      },
    );
  }

  async updateTodoImage(userId, todoId, image) {
    return this.updateUser(
      {
        _id: userId,
        "todos._id": todoId,
      },
      {
        $set: {
          "todos.$.image": image,
        },
      },
    );
  }
}

module.exports.ReadDBService = ReadDBService;
