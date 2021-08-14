const User = require("../models/User");

exports.getUser = async (req, res) => {
  try {
    const user = await User.find({ email: req.params.email });
    res.json(user);
  } catch (err) {
    res.status(500).json("Can't fetch user details");
  }
};
