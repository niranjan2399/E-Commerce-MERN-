const Category = require("../models/Category");
const Product = require("../models/Product");
const slugify = require("slugify");

exports.create = async (req, res) => {
  const { name } = req.body;

  try {
    const newCategory = await new Category({
      name,
      slug: slugify(name),
    }).save();

    res.json(newCategory);
  } catch (err) {
    res.status(400).send("Create category failed");
  }
};

exports.list = async (req, res) => {
  try {
    const data = await Category.find({});
    res.json(data.sort((a, b) => a.createdAt - b.createdAt));
  } catch (err) {
    res.status(500).json("Cannot List Category");
  }
};

exports.read = async (req, res) => {
  try {
    const category = await Category.find({ slug: req.params.slug });
    const products = await Product.find({ category });
    res.json({ category, products });
  } catch (err) {
    res.status(400).json("Can't find Category");
  }
};

exports.update = async (req, res) => {
  const { name } = req.body;

  try {
    const updatedCategory = await Category.findOneAndUpdate(
      { slug: req.params.slug },
      { name, slug: slugify(name) },
      { new: true }
    );
    res.json(updatedCategory);
  } catch (err) {
    res.status(500).json("Category update failed");
  }
};

exports.remove = async (req, res) => {
  try {
    await Category.findOneAndDelete({ slug: req.params.slug });
    res.json("Category deleted");
  } catch (err) {
    res.status(500).json("Category delete failed");
  }
};
