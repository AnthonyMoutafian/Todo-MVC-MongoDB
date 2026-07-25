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
}

module.exports.ReadDBService = ReadDBService;
