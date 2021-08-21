const Coupon = require("../models/Coupon");

exports.create = async (req, res) => {
  try {
    const { name, expiry, discount } = req.body;
    const newCoupon = await new Coupon({
      name,
      expiry,
      discount,
    }).save();

    res.json(newCoupon);
  } catch (err) {
    res.status(400).json(err);
  }
};

exports.list = async (req, res) => {
  try {
    const listCoupons = await Coupon.find({}).sort({ createdAt: -1 });

    res.json(listCoupons);
  } catch (err) {
    res.status(400).json(err);
  }
};

exports.remove = async (req, res) => {
  try {
    const deleteCoupon = await Coupon.findByIdAndDelete(req.params.couponId);

    res.json(deleteCoupon);
  } catch (err) {
    res.status(400).json(err);
  }
};
