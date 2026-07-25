const { Schema, model } = require("mongoose");

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
  todos: [todoSchema],
});

module.exports = model("CurrentUser", currentUserSchema);
