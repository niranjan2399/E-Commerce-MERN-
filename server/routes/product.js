const express = require("express");
const router = express.Router();

// middlewares
const { authCheck, adminCheck } = require("../middlewares/auth");

// controllers
const { create, list, remove, read } = require("../controllers/product");

router.post("/product", authCheck, adminCheck, create);
router.get("/product/:count", list);
router.delete("/product/:slug", authCheck, adminCheck, remove);
router.get("/product/:slug", read);

module.exports = router;
