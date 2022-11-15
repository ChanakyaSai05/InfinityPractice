const _ = require("lodash");
const Joi = require("joi");
const bcrypt = require("bcrypt");
const { User, validate } = require("../models/User");
const { Order } = require("../models/Order");
const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");

function validateLogin(req) {
  const schema = Joi.object({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  });

  return schema.validate(req);
}

// Getting the list of users
router.get("/users", async (req, res) => {
  const users = await User.find().populate("Orders");

  res.send({
    "Total users": users.length,
    Data: users,
  });
});

// When the user clicks on register
router.post("/register", async (req, res) => {
  // Checking the errors in data
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  // Checks if the user is exist or not
  let user = await User.findOne({ email: req.body.email });
  //   console.log(user);
  if (user) return res.status(400).send("User already registered");

  // If the user not present already creating new user
  user = new User(
    _.pick(req.body, ["First_name", "Last_name", "email", "password"])
  );

  // ENcrypting the password
  const salt = await bcrypt.genSalt(10);
  user.password = await bcrypt.hash(user.password, salt);

  user = await user.save();
  // if (req.body.Orders) {
  //   req.body.Orders.forEach(async (item) => {
  //     console.log(item);
  //     let order = new Order(_.pick(item, ["Product_name", "Status"]));
  //     console.log(order);
  //     order = await order.save();
  //     await User.findByIdAndUpdate(user._id, {
  //       $push: { Orders: order._id },
  //     }).populate("Orders");
  //   });
  // }
  const token = user.generateAuthToken();
  res.header("x-auth-token", token).status(201).send({
    token: token,
    user: user,
  });
  // res.status(201).send(user);
});

// Login
router.post("/login", async (req, res) => {
  const { error } = validateLogin(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  let user = await User.findOne({ email: req.body.email }).populate("Orders");
  if (!user) return res.status(400).send("Invalid email or password");

  const validPassword = await bcrypt.compare(req.body.password, user.password);
  if (!validPassword) return res.status(400).send("Invalid email or password");

  const token = user.generateAuthToken();

  //creates one token and sending that token
  res.header("x-auth-token", token).status(200).send({
    token: token,
    user: user,
  });
  // res.status(200).send(user);
});

//add orders to user which are already present
router.put("/orderadd", auth, async (req, res) => {
  let order = await Order.findOne({ Product_name: req.body.Product_name });

  order = new Order(_.pick(req.body, ["Product_name"]));
  order = await order.save();
  const orderId = order._id;
  const userId = req.user._id;

  const added = await User.findByIdAndUpdate(
    userId,
    {
      $push: { Orders: orderId },
    },
    {
      new: true,
    }
  )
    .sort({ updatedAt: -1 })
    .populate("Orders");
  if (!added) {
    res.status(400).send({ message: "User not found" });
  } else {
    res.status(200).json(added);
  }
});
//delete order from user
router.put("/orderremove", auth, async (req, res) => {
  const userId = req.user._id;
  const orderId = req.body.orderId;
  const removed = await User.findByIdAndUpdate(
    userId,
    {
      $pull: { Orders: orderId },
    },
    {
      new: true,
    }
  )
    .sort({ updatedAt: -1 })
    .populate("Orders");

  await Order.findByIdAndDelete(orderId);
  if (!removed) {
    res.status(400).send({ message: "User not found" });
  } else {
    res.status(200).json(removed);
  }
});

module.exports = router;
