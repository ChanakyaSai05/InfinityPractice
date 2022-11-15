const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
  {
    First_name: { type: String, required: true },
    Last_name: { type: String, required: true },
    email: { type: String, required: true },
  },
  { timestamps: true }
);

const User1 = mongoose.model("User1", UserSchema);

exports.UserSchema = UserSchema;
exports.User1 = User1;
