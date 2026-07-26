const mongoose = require("mongoose");

class ReadDBService {
  constructor(models) {
    this.models = models;
  }

  async getUsers() {
    return await this.models.users.find();
  }

  async getCurrentUser() {
    return await this.models.currentUser.findOne();
  }

  async updateUserAndCurrentUser(filter, update) {
    const userResult = await this.models.users.updateOne(filter, update);

    const currentUserResult = await this.models.currentUser.updateOne(
      filter,
      update,
    );
    return {
      userResult,
      currentUserResult,
    };
  }

  async updateTodos(userId, update) {
    await this.updateUserAndCurrentUser(
      {
        _id: userId,
      },
      update,
    );
  }

  async updateAvatar(userId, avatar) {

    return this.updateUserAndCurrentUser(
        { _id: userId },
        {
            $set: {
                avatar,
            },
        }
    );

}

async updateTodoImage(userId, todoId, image) {

    return this.updateUserAndCurrentUser(
        {
            _id: userId,
            "todos._id": todoId,
        },
        {
            $set: {
                "todos.$.image": image,
            },
        }
    );

}
}

module.exports.ReadDBService = ReadDBService;
