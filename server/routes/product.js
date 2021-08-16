const express = require("express");
const router = express.Router();

// middlewares
const { authCheck, adminCheck } = require("../middlewares/auth");

// controllers
const {
  create,
  list,
  remove,
  read,
  update,
  listAccordingly,
  productsCount,
} = require("../controllers/product");

router.post("/product", authCheck, adminCheck, create);
router.get("/product/:count", list);
router.get("/products/total", productsCount);
router.delete("/product/:slug", authCheck, adminCheck, remove);
router.put("/product/:slug", authCheck, adminCheck, update);
router.get("/product/update/:slug", read);
router.post("/products", listAccordingly);

module.exports = router;
