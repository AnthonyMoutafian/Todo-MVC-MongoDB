const bcrypt = require("bcryptjs");
const { ReadDBService } = require("./readDBService");
const { schema } = require("../schema/schema");

class AuthServices extends ReadDBService {
  async registerUser(body) {
    const db = super.getDB();

    const newUser = await schema.validateAsync(body);

    const exists = await db.collection("users").findOne({
      email: newUser.email,
    });

    if (exists) {
      throw new Error("Email already exists");
    }

    newUser.password = await bcrypt.hash(newUser.password, 10);
    newUser.todos = [];

    await db.collection("users").insertOne(newUser);
  }

  async loginUser(body) {
    const db = super.getDB();

    const user = await db.collection("users").findOne({
      email: body.email,
    });

    if (!user) {
      throw new Error("Invalid email or password");
    }

    const matched = await bcrypt.compare(body.password, user.password);

    if (!matched) {
      throw new Error("Invalid email or password");
    }

    await db.collection("currentUser").deleteMany({});

    await db.collection("currentUser").insertOne(user);

    return user;
  }

  async logoutUser() {
    const db = super.getDB();

    await db.collection("currentUser").deleteMany({});
  }
}

module.exports.AuthServices = AuthServices;
