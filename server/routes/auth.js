const express = require("express");
const router = express.Router();

// middlewares
const { authCheck, adminCheck } = require("../middlewares/auth");

// controllers
const { createOrUpdateUser, currentUser } = require("../controllers/auth");

router.post("/auth/create-or-update-user", authCheck, createOrUpdateUser);
router.post("/auth/current-user", authCheck, currentUser);
router.post("/auth/current-admin", authCheck, adminCheck, currentUser);

module.exports = router;
