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
  listRelated,
  searchFilters,
} = require("../controllers/product");

router.post("/product", authCheck, adminCheck, create);
router.get("/product/:count", list);
router.get("/products/total", productsCount);
router.delete("/product/:slug", authCheck, adminCheck, remove);
router.put("/product/:slug", authCheck, adminCheck, update);
router.get("/product/read/:slug", read);
router.post("/products", listAccordingly);

// related
router.get("/product/related/:productId", listRelated);

// rating
router.put("/product/star/:productId", authCheck, productStar);

// search
router.post("/search/filter", searchFilters);

module.exports = router;
