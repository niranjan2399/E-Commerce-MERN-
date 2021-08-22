const router = require("express").Router();

const {
  getUser,
  userCart,
  getUserCart,
  deleteCart,
  saveAddress,
  applyCoupon,
  createOrder,
  orders,
  updateWishList,
  wishList,
  addToWishList,
} = require("../controllers/user");

const { authCheck } = require("../middlewares/auth.js");

// route.post("/user/:email", getUser);
router.post("/user/cart", authCheck, userCart);
router.get("/user/cart", authCheck, getUserCart);
router.delete("/user/cart", authCheck, deleteCart);
router.post("/user/cart/coupon", authCheck, applyCoupon);

router.post("/user/address", authCheck, saveAddress);

router.post("/user/order", authCheck, createOrder);
router.get("/user/orders", authCheck, orders);

router.post("/user/wishlist", authCheck, addToWishList);
router.get("/user/wishlist", authCheck, wishList);
router.put("/user/wishlist/:productId", authCheck, updateWishList);

module.exports = router;
