import React, { useState, useEffect } from "react";
import { useParams, useHistory, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Rating } from "@material-ui/lab";
import { Box, CircularProgress, IconButton } from "@material-ui/core";
import {
  Close,
  FavoriteBorder,
  ShoppingCartOutlined,
  StarOutline,
} from "@material-ui/icons";
import ImageCarousel from "../../components/imageCarousel/ImageCarousel";
import Navbar from "../../components/navbar/Navbar";
import Overlay from "../../components/overlay/Overlay";
import Tabs from "../../components/tabs/Tabs";
import { getProduct, getRelated, setRatings } from "../../utils/product";
import { toast } from "react-toastify";
import { averageRating } from "../../utils/rating";
import ProductCard from "../../components/productCard/ProductCard";
import { labels } from "../../utils/starLabels";
import "./product.scss";
import { handleAddToCart, removeFromCart } from "../../utils/cart";

function Product() {
  const { user, cart } = useSelector((state) => ({ ...state }));
  const [product, setProduct] = useState(null);
  const [related, setRelated] = useState(null);
  const [value, setValue] = useState(0);
  const [hover, setHover] = useState(-1);
  const [showModel, setShowModel] = useState(false);
  const dispatch = useDispatch();
  const [addedToCart, setAddedToCart] = useState(false);
  const slug = useParams().slug;
  const history = useHistory();

  useEffect(() => {
    (async () => {
      const res = await getProduct(slug);
      const relatedRes = await getRelated(res.data._id);
      setProduct(res.data);
      setRelated(relatedRes.data);
    })();

    return () => {
      setProduct([]);
      setRelated([]);
    };
  }, [slug]);

  useEffect(() => {
    product &&
      cart &&
      setAddedToCart(cart.some((p) => p._id === product._id) ? true : false);
  }, [cart, product]);

  useEffect(() => {
    if (user && product && product.ratings.length > 0) {
      setValue(product.ratings.find((obj) => obj.postedBy === user._id).star);
    }
  }, [user, product]);

  const colors = {
    Blue: "#6E8CD5",
    Red: "#F56060",
    Green: "#44C28D",
    Black: "#393c45",
    Silver: "#C0C0C0",
  };

  const data = [
    {
      url: "https://res.cloudinary.com/dcvu9wyh0/image/upload/v1629170417/beakxjmgf4v50fcjp7e4.jpg",
    },
    {
      url: "https://res.cloudinary.com/dcvu9wyh0/image/upload/v1629048145/iyq8sgu49of813qwtpzi.jpg",
    },
    {
      url: "https://res.cloudinary.com/dcvu9wyh0/image/upload/v1629047189/yb4bf7zk2s6akisyhxxa.jpg",
    },
  ];

  const handleRatingModal = () => {
    if (user) {
      setShowModel(true);
    } else {
      history.push({
        pathname: "/login",
        state: {
          from: `/product/${slug}`,
        },
      });
    }
  };

  const handleStarValue = async (_, value) => {
    setValue(value);
  };

  const submitStarRating = async () => {
    await setRatings(value, product._id, user.token);
    const res = await getProduct(slug);
    setProduct(res.data);
    setShowModel(false);
    toast.success("Thanks for your review");
  };

  return (
    <>
      <Navbar />
      <div className="pdContainer">
        <Overlay className="reveal" />
        {product ? (
          <div className="pdContainer__main">
            <div
              className={
                "pdContainer__ratingModel" + (showModel ? " show" : "")
              }
            >
              <div className="pdContainer__ratingTop">
                <span>Leave a Rating</span>
                <IconButton onClick={() => setShowModel(false)}>
                  <Close />
                </IconButton>
              </div>
              <div className="pdContainer__ratingMid">
                <Rating
                  name={product._id}
                  value={value}
                  precision={0.5}
                  size="large"
                  onChange={handleStarValue}
                  onChangeActive={(_, newHover) => {
                    setHover(newHover);
                  }}
                />
                {value !== null && (
                  <Box
                    margin="0.25rem 0"
                    textAlign="center"
                    fontSize="0.8rem"
                    ml={2}
                  >
                    {labels[hover !== -1 ? hover : value]}
                  </Box>
                )}
              </div>
              <div className="pdContainer__ratingButtons">
                <button onClick={() => setShowModel(false)}>Cancel</button>
                <button onClick={submitStarRating}>Submit</button>
              </div>
            </div>
            <div className="pdContainer__carousel">
              {product && <ImageCarousel images={data} />}
            </div>
            <div className="pdContainer__detailContainer">
              <div className="pdContainer__title">{product.title}</div>
              {product && product.ratings && averageRating(product)}
              <div className="pdContainer__details">
                <div className="pdContainer__detailsLeft">
                  <Tabs product={product} />
                  <ul className="pdContainer__info">
                    <li>
                      Price<span>${product.price}</span>
                    </li>
                    <li>
                      Category
                      <Link
                        className="pdContainer__infoLink"
                        to={`/category/${product.category.slug}`}
                      >
                        <span>{product.category.name}</span>
                      </Link>
                    </li>
                    <li>
                      Sub Categories
                      {product.subs.map((sub) => (
                        <Link
                          className="pdContainer__infoLink"
                          to={`/subcategory/${sub.slug}`}
                        >
                          <span>{sub.name}</span>
                        </Link>
                      ))}
                    </li>
                    <li>
                      Shipping<span>{product.shipping}</span>
                    </li>
                    <li>
                      Colors
                      <div>
                        {product.color.map((clr) => {
                          return (
                            <div key={clr}>
                              <span
                                style={{
                                  backgroundColor: `${colors[clr]}`,
                                }}
                              ></span>
                            </div>
                          );
                        })}
                      </div>
                    </li>
                    <li>
                      Available<span>{product.quantity}</span>
                    </li>
                    <li>
                      Sold<span>{product.sold}</span>
                    </li>
                  </ul>
                </div>
                <div className="pdContainer__buttonDiv">
                  {addedToCart ? (
                    <button onClick={() => removeFromCart(product, dispatch)}>
                      <ShoppingCartOutlined className="icon" />
                      Added
                    </button>
                  ) : (
                    <button onClick={() => handleAddToCart(product, dispatch)}>
                      <ShoppingCartOutlined className="icon" />
                      Add to Cart
                    </button>
                  )}
                  <button onClick={handleRatingModal}>
                    <StarOutline className="icon" />
                    {user ? "Leave a Rating" : "Login to leave Rating"}
                  </button>
                  <button>
                    <FavoriteBorder className="icon" /> Add to Wishlist
                  </button>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div style={{ padding: "5rem" }}>
            <CircularProgress style={{ color: "#8167a9", fontSize: "2rem" }} />
          </div>
        )}
        {related && (
          <div className="pdContainer__related">
            <div className="pdRelated__title">Related Products</div>
            <div className="pdRelated__main">
              {related.map((r) => {
                return <ProductCard product={r} key={r._id} />;
              })}
            </div>
          </div>
        )}
      </div>
    </>
  );
}

export default Product;
