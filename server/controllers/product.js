const Product = require("../models/Product");
const slugify = require("slugify");

exports.create = async (req, res) => {
  try {
    const slug = slugify(req.body.title);
    console.log(req.body);

    const newProduct = await new Product({ ...req.body, slug }).save();
    res.json(newProduct);
  } catch (err) {
    res.status(400).json("Create Product failed");
  }
};

exports.list = async (req, res) => {
  try {
    const data = await Product.find({})
      .limit(parseInt(req.params.count))
      .populate("category")
      .populate("subs")
      .sort([["createdAt", "desc"]]);
    res.json(data);
  } catch (err) {
    res.status(400).json("Can't list Products");
  }
};

exports.remove = async (req, res) => {
  try {
    const deletedProduct = await Product.findOneAndDelete({
      slug: req.params.slug,
    });
    res.json(deletedProduct);
  } catch (err) {
    res.status(400).json("Product delete failed");
  }
};

exports.read = async (req, res) => {
  try {
    const product = await Product.findOne({ slug: req.params.slug });
    res.json(product);
  } catch (err) {
    res.status(400).json("Can't read Product");
  }
};
