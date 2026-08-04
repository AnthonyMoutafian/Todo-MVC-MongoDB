const { Schema, model } = require("mongoose");
const bcrypt = require("bcryptjs");

const imageSchema = new Schema(
  {
    fileId: String,
    url: String,
  },
  { _id: false },
);

const todoSchema = new Schema({
  todo: {
    type: String,
    required: true,
    trim: true,
  },
  isChecked: {
    type: Boolean,
    default: false,
  },
  isEditing: {
    type: Boolean,
    default: false,
  },
  image: imageSchema,
});

const userSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    trim: true,
    lowercase: true,
    match: /^\S+@\S+\.\S+$/,
    unique: true,
  },
  password: {
    type: String,
    required: true,
    minlength: 6,
    validate: {
      validator: function (value) {
        return /(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(value);
      },
    },
  },
  avatar: {
    type: imageSchema,
    default: null,
  },
  todos: [todoSchema],
  refreshToken: {
    type: String,
    default: null,
  },
});

userSchema.pre("save", async function () {
  const hashedPassword = await bcrypt.hash(this.password, 10);
  this.password = hashedPassword;
});

module.exports = model("User", userSchema);
