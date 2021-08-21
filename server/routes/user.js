const route = require("express").Router();

const {
  getUser,
  userCart,
  getUserCart,
  deleteCart,
  saveAddress,
  applyCoupon,
} = require("../controllers/user");
const { authCheck } = require("../middlewares/auth.js");

// route.post("/user/:email", getUser);
route.post("/user/cart", authCheck, userCart);
route.get("/user/cart", authCheck, getUserCart);
route.delete("/user/cart", authCheck, deleteCart);
route.post("/user/address", authCheck, saveAddress);
route.post("/user/cart/coupon", authCheck, applyCoupon);

module.exports = route;
