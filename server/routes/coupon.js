const router = require("express").Router();

const { create, list, remove } = require("../controllers/coupon");
const { authCheck, adminCheck } = require("../middlewares/auth.js");

router.post("/coupon", authCheck, adminCheck, create);
router.get("/coupons", list);
router.delete("/coupon/:couponId", authCheck, adminCheck, remove);

module.exports = router;
