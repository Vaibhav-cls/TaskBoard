const mongoose = require("mongoose");
const Task = require("./task");
const Schema = mongoose.Schema;
const userSchema = new Schema({
  first_name: {
    type: String,
    required: true,
  },
  last_name: {
    type: String,
    required: true,
  },
  username: {
    type: String,
    default: "user",
  },
  email: {
    type: String,
    default: "abc@mail.com",
  },
  type_of_user: {
    type: String,
    default: "normal",
  },
  password: {
    type: String,
    required: true,
  },
  phone_number: {
    type: Number,
    default: 1231231231,
  },
  task: [
    {
      type: Schema.Types.ObjectId,
      ref: "Task",
    },
  ],
});
const User = mongoose.model("User", userSchema);
module.exports = User;
