const bcrypt = require("bcryptjs");
const { ReadDBService } = require("./readDBService");
const { schema } = require("../schema/schema");
const googleDrive = require("./googleDriveService");
const jwt = require("jsonwebtoken");

class AuthServices extends ReadDBService {
  constructor(models) {
    super(models);
  }

  async uploadAvatar(userId, file) {
    const user = await this.getUserById(userId);

    if (!user) {
      throw new Error("User not found");
    }

    const uploaded = await googleDrive.replaceFile(
      user.avatar?.fileId,
      file.path,
      file.filename,
      "avatar",
    );

    await this.updateAvatar(userId, uploaded);

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

    newUser.todos = [];
    newUser.avatar = null;

    const createdUser = await this.models.users.create(newUser);

    const token = jwt.sign({ id: createdUser._id }, process.env.JWT_SECRET, {
      expiresIn: "10s",
    });

    const { password, ...user } = createdUser._doc;

    return {
      ...user,
      token,
    };
  }

  async loginUser(body) {
    const user = await this.models.users.findOne({
      email: body.email,
    });

    if (!user) {
      throw new Error("Invalid email or password");
    }

    const validPassword = await bcrypt.compare(body.password, user.password);

    if (!validPassword) {
      throw new Error("Invalid email or password");
    }

    return jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });
  }

  async logoutUser() {
    return true;
  }

  async deleteAvatar(userId) {
    const user = await this.getUserById(userId);

    if (!user) {
      throw new Error("User not found");
    }

    if (user.avatar?.fileId) {
      await googleDrive.deleteFile(user.avatar.fileId);
    }

    await this.updateAvatar(userId, null);

    return true;
  }
}

module.exports.AuthServices = AuthServices;