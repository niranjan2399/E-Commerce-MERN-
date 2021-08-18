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
  productStar,
} = require("../controllers/product");

router.post("/product", authCheck, adminCheck, create);
router.get("/product/:count", list);
router.get("/products/total", productsCount);
router.delete("/product/:slug", authCheck, adminCheck, remove);
router.put("/product/:slug", authCheck, adminCheck, update);
router.get("/product/read/:slug", read);
router.post("/products", listAccordingly);

// rating
router.put("/product/star/:productId", authCheck, productStar);

module.exports = router;
