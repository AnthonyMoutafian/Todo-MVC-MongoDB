const { Schema, model } = require("mongoose");

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

const currentUserSchema = new Schema({
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
    minlength: 8,
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
});

module.exports = model("CurrentUser", currentUserSchema);
