const Product = require("../models/Product");
const slugify = require("slugify");

exports.create = async (req, res) => {
  try {
    const slug = slugify(req.body.title);
    console.log(req.body);

    const newProduct = await new Product({ ...req.body, slug }).save();
    res.json(newProduct);
  } catch (err) {
    console.log(err);
    res.status(400).json("Create Product failed");
  }
};

exports.list = async (req, res) => {
  try {
    const data = await Product.find({});
    res.json(data);
  } catch (err) {
    res.status(400).json("Can't list Products");
  }
};
