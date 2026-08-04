const bcrypt = require("bcryptjs");
const { ReadDBService } = require("./readDBService");
const { schema } = require("../schema/schema");
const googleDrive = require("./googleDriveService");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");

class AuthServices extends ReadDBService {
  constructor(models) {
    super(models);
  }

  createAccessToken(userId) {
    return jwt.sign(
      {
        id: userId,
        jti: crypto.randomUUID(),
      },
      process.env.ACCESS_SECRET,
      {
        expiresIn: "15m",
      },
    );
  }

  createRefreshToken(userId) {
    return jwt.sign(
      {
        id: userId,
        jti: crypto.randomUUID(),
      },
      process.env.REFRESH_SECRET,
      {
        expiresIn: "7d",
      },
    );
  }

  async refreshAccessToken(refreshToken) {
    if (!refreshToken) {
      throw new Error("Unauthorized");
    }

    try {
      const payload = jwt.verify(refreshToken, process.env.REFRESH_SECRET);

      const user = await this.getUserById(payload.id);

      if (!user) {
        throw new Error("Unauthorized");
      }

      if (user.refreshToken !== refreshToken) {
        throw new Error("Unauthorized");
      }

      return this.createAccessToken(user._id);
    } catch (err) {
      throw new Error("Unauthorized");
    }
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
    newUser.refreshToken = null;

    const createdUser = await this.models.users.create(newUser);

    const { password, refreshToken, ...user } = createdUser._doc;

    return user;
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

    const accessToken = this.createAccessToken(user._id);

    const refreshToken = this.createRefreshToken(user._id);

    await this.updateUser(
      {
        _id: user._id,
      },
      {
        $set: {
          refreshToken,
        },
      },
    );

    return {
      accessToken,
      refreshToken,
    };
  }

  async logoutUser(userId) {
    await this.updateUser(
      {
        _id: userId,
      },
      {
        $set: {
          refreshToken: null,
        },
      },
    );

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
