const router = require("express").Router();

const { authCheck, adminCheck } = require("../middlewares/auth.js");

const { orders, orderStatus } = require("../controllers/admin");

router.put("/admin/order-status", authCheck, adminCheck, orderStatus);
router.get("/admin/orders", authCheck, adminCheck, orders);

module.exports = router;
