const { Order } = require("../models/Order");
const express = require("express");
const router = express.Router();

//Get all orders
router.get("/", async (req, res) => {
  const orders = await Order.find().sort({ createdAt: -1 });

  if (!orders) return res.status(404).send("No Orders Yet.");

  res.status(200).send(orders);
});

module.exports = router;
