const express = require("express");
const router = express.Router();

// middlewares
const { authCheck, adminCheck } = require("../middlewares/auth");

// controllers
const {
  create,
  update,
  remove,
  read,
  list,
  deleteAll,
  getForCa,
  getForCategory,
} = require("../controllers/subCategory");

router.post("/sub", authCheck, adminCheck, create);
router.get("/sub", list);
router.get("/sub/:slug", read);
router.put("/sub/:slug", authCheck, adminCheck, update);
router.delete("/sub/:slug", authCheck, adminCheck, remove);
router.get("/sub/category/:id", getForCategory);

module.exports = router;
