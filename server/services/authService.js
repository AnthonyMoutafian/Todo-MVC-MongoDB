const bcrypt = require("bcryptjs");
const { ReadDBService } = require("./readDBService");
const { schema } = require("../schema/schema");

class AuthServices extends ReadDBService {
  constructor(models) {
    super(models);
  }

  async registerUser(body) {
    const newUser = await schema.validateAsync(body);

    const exists = await this.models.users.findOne({
      email: newUser.email,
    });

    if (exists) {
      throw new Error("Email already exists");
    }

    newUser.password = await bcrypt.hash(newUser.password, 10);
    newUser.todos = [];

    await this.models.users.create(newUser);
  }

  async loginUser(body) {
    const user = await this.models.users.findOne({
      email: body.email,
    });

    if (!user) {
      throw new Error("Invalid email or password");
    }

    const matched = await bcrypt.compare(body.password, user.password);

    if (!matched) {
      throw new Error("Invalid email or password");
    }

    await this.models.currentUser.deleteMany({});

    await this.models.currentUser.create({
      _id: user._id,
      name: user.name,
      email: user.email,
      password: user.password,
      todos: user.todos,
    });

    return user;
  }

  async logoutUser() {
    await this.models.currentUser.deleteMany({});
  }
}

module.exports.AuthServices = AuthServices;
