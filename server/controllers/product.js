const Product = require("../models/Product");
const slugify = require("slugify");
const User = require("../models/User");

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
    const product = await Product.findOne({ slug: req.params.slug })
      .populate("category")
      .populate("subs");
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
  const { sort, order, limit } = req.body;

  try {
    // created/updatedAt,desc/asc, no
    const data = await Product.find({})
      .populate("category")
      .populate("subs")
      .sort([[sort, order]])
      .limit(limit);
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

exports.productStar = async (req, res) => {
  try {
    const product = await Product.findById(req.params.productId);
    const user = await User.findOne({ email: req.user.email });
    const { star } = req.body;

    const alreadyRated = product.ratings.find(
      (rating) => rating.postedBy.toString() === user._id.toString()
    );

    if (alreadyRated === undefined) {
      let ratingAdded = await Product.findOneAndUpdate(
        { _id: req.params.productId },
        {
          $push: { ratings: { star, postedBy: user._id } },
        },
        { new: true }
      );
      res.json(ratingAdded);
    } else {
      let updatedProduct = await Product.updateOne(
        {
          ratings: { $elemMatch: alreadyRated },
        },
        {
          $set: { "ratings.$.star": star },
        },
        { new: true }
      );
      res.json(updatedProduct);
    }
  } catch (err) {
    res.status(400).json(err);
  }
};

exports.listRelated = async (req, res) => {
  const product = await Product.findById(req.params.productId);

  const related = await Product.find({
    _id: { $ne: product._id },
    category: product.category,
  }).limit(3);

  res.json(related);
};

// search
const handleQuery = async (_, res, query) => {
  try {
    const products = await Product.find({ $text: { $search: query } })
      .populate("category", "_id name")
      .populate("subs", "_id name");

    res.json(products);
  } catch (err) {
    res.status(400).json(err);
  }
};

const handlePrice = async (_, res, price) => {
  try {
    const products = await Product.find({
      price: {
        $gte: price[0],
        $lte: price[1],
      },
    });

    res.json(products);
  } catch (err) {
    res.status(400).json(err);
  }
};

const handleCategory = async (_, res, category) => {
  try {
    const products = await Product.find({ category });
    res.json(products);
  } catch (err) {
    res.json(err);
  }
};

const handleRating = async (_, res, stars) => {
  try {
    const aggregate = await Product.aggregate([
      {
        $project: {
          document: "$$ROOT",
          floorAverage: {
            $floor: { $avg: "$ratings.star" },
          },
        },
      },
      {
        $match: { floorAverage: stars },
      },
    ]);

    const products = await Product.find({ _id: aggregate });
    res.json(products);
  } catch (err) {
    res.status(400).json(err);
  }
};

const handleColor = async (_, res, color) => {
  try {
    const products = await Product.find({ color });
    res.json(products);
  } catch (err) {
    res.status(400).json(err);
  }
};

const handleShipping = async (_, res, shipping) => {
  try {
    const products = await Product.find({ shipping });
    res.json(products);
  } catch (err) {
    res.status(400).json(err);
  }
};

exports.searchFilters = async (req, res) => {
  const { query, price, category, stars, color, shipping } = req.body;

  if (query) {
    await handleQuery(req, res, query);
  }
  // price [x,y]
  if (price !== undefined) {
    await handlePrice(req, res, price);
  }

  if (category !== undefined) {
    await handleCategory(req, res, category);
  }

  if (stars !== undefined) {
    await handleRating(req, res, stars);
  }
  if (color !== undefined) {
    await handleColor(req, res, color);
  }
  if (shipping !== undefined) {
    await handleShipping(req, res, shipping);
  }
};
