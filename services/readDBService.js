const fs = require("fs").promises;
const path = require("path");
const { DB } = require("./db");

class ReadDBService extends DB {
  async getDB() {
    const db = await super.getDb()
    return db;
  }
  async getUsers() {
    const db = await this.getDB();
    const users = db.collection("users").find({}).toArray();
    return users;
  }
  async getCurrentUser() {
    const db = await this.getDB();
    return await db.collection("currentUser").findOne({});
  }
  async saveToUsers(id, update) {
    const db = await this.getDB();

    await db.collection("users").updateOne({ _id: id }, update);
  }

  async saveToCurrentUser(id, update) {
    const db = await this.getDB();

    await db.collection("currentUser").updateOne({ _id: id }, update);
  }
  async updateTodos(userId, update) {
    await this.saveToUsers(userId, update);
    await this.saveToCurrentUser(userId, update);
}
}

module.exports.ReadDBService = ReadDBService;
