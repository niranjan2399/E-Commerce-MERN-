const User = require("../models/User");

exports.createOrUpdateUser = async (req, res) => {
  const { picture, email } = req.user;
  const name = req.body.name || req.user.name;

  try {
    const user = await User.findOneAndUpdate(
      { email: email },
      {
        $set: { email, picture, name },
      },
      { new: true }
    );

    if (user) {
      console.log("User Updated");
      res.json(user);
    } else {
      const newUser = await new User({
        email,
        picture,
        name,
      }).save();
      console.log("User Created");
      res.json(newUser);
    }
  } catch (err) {
    res.status(400).json("Unable to create User");
  }
};

exports.currentUser = async (req, res) => {
  try {
    const user = await User.find({ email: req.user.email });
    res.json(user);
  } catch (err) {
    res.status(500).json("Can't find User");
  }
};
