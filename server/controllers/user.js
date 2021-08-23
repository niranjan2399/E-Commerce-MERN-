const User = require("../models/User");
const Product = require("../models/Product");
const Cart = require("../models/Cart");
const Coupon = require("../models/Coupon");
const Order = require("../models/Order");

exports.getUser = async (req, res) => {
  try {
    const user = await User.find({ email: req.params.email });
    res.json(user);
  } catch (err) {
    res.status(500).json("Can't fetch user details");
  }
};

exports.userCart = async (req, res) => {
  try {
    const cart = req.body;
    let products = [];

    const user = await User.findOne({ email: req.user.email });

    const alreadyInCart = await Cart.findOne({ orderedBy: user._id });

    if (alreadyInCart) {
      alreadyInCart.remove();
    }

    for (let i = 0; i < cart.length; i++) {
      const object = {};

      object.product = cart[i]._id;
      object.count = cart[i].count;
      object.color = cart[i].color;

      let { price } = await Product.findById(cart[i]._id).select("price");
      object.price = price;

      products.push(object);
    }

    let cartTotal = 0;
    for (let i = 0; i < products.length; i++) {
      cartTotal += products[i].price * products[i].count;
    }

    const newCart = await new Cart({
      products,
      cartTotal,
      orderedBy: user._id,
    }).save();
    //

    res.json({ ok: true });
  } catch (err) {
    console.log(err);
    res.status(400).json(err);
  }
};

exports.getUserCart = async (req, res) => {
  try {
    const user = await User.findOne({ email: req.user.email });
    const cart = await Cart.findOne({ orderedBy: user._id }).populate(
      "products.product",
      "_id title price"
    );
    const { products, cartTotal, totalAfterDiscount } = cart;

    res.json({ products, cartTotal, totalAfterDiscount });
  } catch (err) {
    res.status(400).json(err);
  }
};

exports.deleteCart = async (req, res) => {
  try {
    const user = await User.findOne({ email: req.user.email });

    const cart = await Cart.findOneAndDelete({ orderedBy: user._id });
    res.json(cart);
  } catch (err) {
    res.status(400).json(err);
  }
};

exports.saveAddress = async (req, res) => {
  try {
    await User.findOneAndUpdate(
      { email: req.user.email },
      {
        address: req.body.address,
      }
    );

    res.json({ ok: true });
  } catch (err) {
    res.status(400).json(err);
  }
};

exports.applyCoupon = async (req, res) => {
  try {
    const { coupon } = req.body;
    const couponValid = await Coupon.findOne({ name: coupon });

    if (couponValid === null) {
      return res.json({ err: "Invalid Coupon" });
    }

    const user = await User.findOne({ email: req.user.email });
    const { products, cartTotal } = await Cart.findOne({
      orderedBy: user._id,
    }).populate("products.product", "_id title price");

    let totalAfterDiscount = (
      cartTotal -
      (couponValid.discount * cartTotal) / 100
    ).toFixed(2);

    await Cart.findOneAndUpdate(
      { orderedBy: user._id },
      {
        totalAfterDiscount,
      },
      { new: true }
    );

    res.json(totalAfterDiscount);
  } catch (err) {
    res.status(400).json(err);
  }
};

exports.createOrder = async (req, res) => {
  try {
    const { paymentIntent } = req.body.stripeResponse;
    const user = await User.findOne({ email: req.user.email });

    let { products } = await Cart.findOne({ orderedBy: user._id });

    await new Order({
      products,
      paymentIntent,
      orderedBy: user._id,
    }).save();

    // increment sold, decrement quantity
    let bulkOption = products.map((item) => {
      return {
        updateOne: {
          filter: { _id: item.product._id },
          update: {
            $inc: {
              quantity: -item.count,
              sold: +item.count,
            },
          },
        },
      };
    });

    let updated = await Product.bulkWrite(bulkOption, {});

    res.json({ ok: true });
  } catch (err) {
    console.log(err);
    res.status(400).json(err);
  }
};

exports.orders = async (req, res) => {
  try {
    const user = await User.findOne({ email: req.user.email });

    const order = await Order.find({ orderedBy: user._id }).populate(
      "products.product"
    );

    res.json(order);
  } catch (err) {
    res.status(400).json(err);
  }
};

exports.addToWishList = async (req, res) => {
  try {
    const { productId } = req.body;

    await User.findOneAndUpdate(
      { email: req.user.email },
      { $addToSet: { wishlist: productId } }
    );

    res.json({ ok: true });
  } catch (err) {
    res.status(400).json(err);
  }
};

exports.wishList = async (req, res) => {
  try {
    const wishlist = await User.findOne({ email: req.user.email })
      .select("wishlist")
      .populate("wishlist");

    res.json(wishlist);
  } catch (err) {
    res.status(400).json(err);
  }
};

exports.updateWishList = async (req, res) => {
  try {
    const { productId } = req.params;

    const updated = await User.findOneAndUpdate(
      { email: req.user.email },
      {
        $pull: { wishlist: productId },
      }
    );

    res.json({ ok: true });
  } catch (err) {
    res.status(400).json(err);
  }
};
