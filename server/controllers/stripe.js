const User = require("../models/User");
const Cart = require("../models/Cart");
const Product = require("../models/Product");
const Coupon = require("../models/Coupon");
const stripe = require("stripe")(process.env.STRIPE_SECRET);

exports.createPaymentIntent = async (req, res) => {
  try {
    const { couponApplied } = req.body;
    const user = await User.findOne({ email: req.user.email });

    const { cartTotal, totalAfterDiscount } = await Cart.findOne({
      orderedBy: user._id,
    });

    if (couponApplied && totalAfterDiscount) {
      finalAmount = totalAfterDiscount * 100;
    } else {
      finalAmount = cartTotal * 100;
    }

    const paymentIntent = await stripe.paymentIntents.create({
      description: "EC",
      amount: finalAmount,
      currency: "usd",
      shipping: {
        name: user.name,
        // fake address
        address: {
          line1: "510 Townsend St",
          postal_code: "98140",
          city: "San Francisco",
          state: "CA",
          country: "US",
        },
      },
    });

    res.json({
      clientSecret: paymentIntent.client_secret,
      cartTotal,
      totalAfterDiscount,
      payableAmount: finalAmount,
    });
  } catch (err) {
    console.log(err);
    res.status(400).json(err);
  }
};
