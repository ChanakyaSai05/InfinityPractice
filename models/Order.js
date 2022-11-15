const mongoose = require("mongoose");
// creating scheema
const OrderSchema = new mongoose.Schema(
  {
    Product_name: { type: String, required: true },
    Status: { type: String, default: "Pending" },
  },
  { timestamps: true }
);
const Order = mongoose.model("Order", OrderSchema);
exports.OrderSchema = OrderSchema;
exports.Order = Order;
