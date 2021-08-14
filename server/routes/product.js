const express = require("express");
const router = express.Router();

// middlewares
const { authCheck, adminCheck } = require("../middlewares/auth");

// controllers
const { create, list } = require("../controllers/product");

router.post("/product", authCheck, adminCheck, create);
router.get("/product", list);

module.exports = router;
