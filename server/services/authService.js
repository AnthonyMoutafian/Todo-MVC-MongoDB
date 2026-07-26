const bcrypt = require("bcryptjs");
const { ReadDBService } = require("./readDBService");
const { schema } = require("../schema/schema");
const googleDrive = require("./googleDriveService");

class AuthServices extends ReadDBService {
  constructor(models) {
    super(models);
  }

  async uploadAvatar(file) {
    const currentUser = await this.getCurrentUser();

    if (!currentUser) throw new Error("User not found");

    const uploaded = await googleDrive.replaceFile(
      currentUser.avatar?.fileId,
      file.path,
      file.filename,
      "avatar",
    );

    await this.updateAvatar(currentUser._id, uploaded);

    return uploaded;
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
    newUser.avatar = null;

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
      avatar: user.avatar,
      todos: user.todos,
    });

    return user;
  }

  async logoutUser() {
    await this.models.currentUser.deleteMany({});
  }

  async deleteAvatar() {
    const currentUser = await this.getCurrentUser();

    if (!currentUser) {
      throw new Error("User not found");
    }

    if (currentUser.avatar?.fileId) {
      await googleDrive.deleteFile(currentUser.avatar.fileId);
    }

    await this.models.users.updateOne(
      {
        _id: currentUser._id,
      },
      {
        $set: {
          avatar: null,
        },
      },
    );

    await this.models.currentUser.updateOne(
      {
        _id: currentUser._id,
      },
      {
        $set: {
          avatar: null,
        },
      },
    );

    return true;
  }
}

module.exports.AuthServices = AuthServices;
