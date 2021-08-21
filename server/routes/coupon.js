const route = require("express").Router();

const { create, list, remove } = require("../controllers/coupon");
const { authCheck, adminCheck } = require("../middlewares/auth.js");

route.post("/coupon", authCheck, adminCheck, create);
route.get("/coupons", list);
route.delete("/coupon/:couponId", authCheck, adminCheck, remove);

module.exports = route;
