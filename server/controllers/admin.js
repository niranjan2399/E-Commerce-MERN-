const User = require("../models/User");
const Order = require("../models/Order");

exports.orders = async (req, res) => {
  try {
    let orders = await Order.find({})
      .sort({ createdAt: -1 })
      .populate("products.product");

    res.json(orders);
  } catch (err) {
    res.status(400).json(err);
  }
};

exports.orderStatus = async (req, res) => {
  try {
    const { orderId, orderStatus } = req.body;

    let updatedOrder = await Order.findByIdAndUpdate(
      orderId,
      {
        orderStatus,
      },
      { new: true }
    );

    res.json(updatedOrder);
  } catch (err) {
    res.status(400).json(err);
  }
};
