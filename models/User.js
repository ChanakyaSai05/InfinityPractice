const mongoose = require("mongoose");
const Joi = require("joi");
const jwt = require("jsonwebtoken");
const config = require("config");

const UserSchema = new mongoose.Schema(
  {
    First_name: { type: String, required: true },
    Last_name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    Orders: [{ type: mongoose.Schema.Types.ObjectId, ref: "Order" }],
  },
  { timestamps: true }
);
UserSchema.methods.generateAuthToken = function () {
  const token = jwt.sign(
    {
      _id: this._id,
      isAdmin: this.isAdmin,
    },
    config.get("jwtPrivateKey")
  );
  return token;
};
const User = mongoose.model("User", UserSchema);
function validateUser(user) {
  const schema = Joi.object({
    First_name: Joi.string().required(),
    Last_name: Joi.string().required(),
    email: Joi.string().required().email(),
    password: Joi.string().required(),
    Orders: Joi.array(),
  });

  return schema.validate(user);
}

exports.UserSchema = UserSchema;
exports.User = User;
exports.validate = validateUser;
