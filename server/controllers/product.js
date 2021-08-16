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

exports.update = async (req, res) => {
  try {
    req.body.slug = slugify(req.body.title);
    const updatedProduct = await Product.findOneAndUpdate(
      { slug: req.params.slug },
      {
        $set: req.body,
      },
      { new: true }
    );
    res.json(updatedProduct);
  } catch (err) {
    res.status(400).json("Can't Update Product");
  }
};

// WITHOUT PAGINATION
// exports.listAccordingly = async (req, res) => {
//   try {
//     // created/updatedAt,desc/asc, no
//     const { sort, order, limit } = req.body;
//     const data = await Product.find({})
//       .populate("category")
//       .populate("subs")
//       .sort([[sort, order]])
//       .limit(limit);
//     res.json(data);
//   } catch (err) {
//     res.status(400).json(err);
//   }
// };

// WITH PAGINATION
exports.listAccordingly = async (req, res) => {
  const { sort, order, page } = req.body;
  const currentPage = page || 1;
  const perPage = 4;

  try {
    // created/updatedAt,desc/asc, no
    const data = await Product.find({})
      .skip((currentPage - 1) * perPage)
      .populate("category")
      .populate("subs")
      .sort([[sort, order]])
      .limit(perPage);
    res.json(data);
  } catch (err) {
    res.status(400).json(err);
  }
};

exports.productsCount = async (req, res) => {
  try {
    const count = await Product.find({}).estimatedDocumentCount();
    res.json(count);
  } catch (err) {
    res.status(400).json(err);
  }
};
