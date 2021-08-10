const admin = require("../firebase");
const User = require("../models/User");

exports.authCheck = async (req, res, next) => {
  try {
    const firebaseUser = await admin
      .auth()
      .verifyIdToken(req.headers.authtoken);
    req.user = firebaseUser;
    next();
  } catch (err) {
    res.status(401).json({
      err: "Invalid or expired token",
    });
  }
};

exports.adminCheck = async (req, res, next) => {
  try {
    const res = await User.findOne({ email: req.user.email });

    if (res.role !== "admin") {
      res.status(400).json({ message: "Admin resource!  Access Denied" });
    } else {
      next();
    }
  } catch (err) {
    res.status(500).json(err);
  }
};
