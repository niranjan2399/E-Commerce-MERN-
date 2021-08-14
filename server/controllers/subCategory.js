const Sub = require("../models/SubCategory");
const slugify = require("slugify");

exports.create = async (req, res) => {
  const { name, parent } = req.body;

  try {
    const newSub = await new Sub({
      name,
      parent,
      slug: slugify(name),
    }).save();

    res.json(newSub);
  } catch (err) {
    res.status(400).send("Create SubCategory failed");
  }
};

exports.list = async (req, res) => {
  try {
    const data = await Sub.find({});
    res.json(data.sort((a, b) => a.createdAt - b.createdAt));
  } catch (err) {
    res.status(500).json(err);
  }
};

exports.read = async (req, res) => {
  try {
    const sub = await Sub.find({ slug: req.params.slug });
    res.json(sub);
  } catch (err) {
    res.status(500).json(err);
  }
};

exports.update = async (req, res) => {
  const { name, parent } = req.body;

  try {
    const updatedSub = await Sub.findOneAndUpdate(
      { slug: req.params.slug },
      { name, parent, slug: slugify(name) },
      { new: true }
    );
    res.json(updatedSub);
  } catch (err) {
    res.status(500).json({ message: "SubCategory update failed" });
  }
};

exports.remove = async (req, res) => {
  try {
    await Sub.findOneAndDelete({ slug: req.params.slug });
    res.json({ message: "SubCategory deleted" });
  } catch (err) {
    res.status(500).json({ message: "SubCategory delete failed" });
  }
};

exports.getForCategory = async (req, res) => {
  try {
    const data = await Sub.find({ parent: req.params.id });
    res.json(data);
  } catch (err) {
    res.status(400).json(err);
  }
};
