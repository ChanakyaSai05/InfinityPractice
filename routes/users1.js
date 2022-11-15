const User1 = require("../models/User1");
const express = require("express");
const router = express.Router();

router.post("/register", async (req, res) => {
  let user1;
  for (let i = 0; i < 4; i++) {
    user1 = new User1({
      First_name: `F${i + 1}`,
      Last_name: `L${i + 1}`,
      email: `newemail${i + 1}@gmail.com`,
    });
    user1 = await user1.save();
  }
  res.status(200).send(user1);
  // user = await user.save();
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
  // res.header("x-auth-token", token).status(201).send({
  //   token: token,
  //   user: user,
  // });
  // res.status(201).send(user);
});
