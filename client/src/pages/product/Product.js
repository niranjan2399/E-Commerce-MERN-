import React, { useState, useEffect, useRef } from "react";
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
import { formHide } from "../../utils/animate";
import axios from "../../axios";

function Product() {
  const { user, cart } = useSelector((state) => ({ ...state }));
  const [product, setProduct] = useState(null);
  const [related, setRelated] = useState(null);
  const [value, setValue] = useState(0);
  const [hover, setHover] = useState(-1);
  const [addToWishlist, setAddToWishlist] = useState(false);
  const dispatch = useDispatch();
  const [addedToCart, setAddedToCart] = useState(false);
  const slug = useParams().slug;
  const history = useHistory();
  const overlay = useRef();
  const form = useRef();

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
    user &&
      product &&
      (async () => {
        const res = await axios.get("/user/wishlist", {
          headers: {
            authtoken: user.token,
          },
        });

        const found = res.data.wishlist.find((p) => p._id === product._id);
        console.log(found);
        found && setAddToWishlist(true);
      })();
  }, [product, user]);

  useEffect(() => {
    if (user && product && product.ratings) {
      const userRating = product.ratings.find(
        (obj) => obj.postedBy === user._id
      );
      userRating && setValue(userRating.star);
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
      overlay.current.classList.add("reveal");
      form.current.classList.add("reveal");
      document.body.style.overflowY = "hidden";
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
    toast.success("Thanks for your review");
  };

  const handleAddToWishlist = async () => {
    try {
      if (addToWishlist === true) {
        await axios.put(
          `/user/wishlist/${product._id}`,
          {},
          {
            headers: {
              authtoken: user.token,
            },
          }
        );

        setAddToWishlist(false);
        toast.success("Removed from Wishlist");
      } else {
        await axios.post(
          "/user/wishlist",
          { productId: product._id },
          {
            headers: {
              authtoken: user.token,
            },
          }
        );

        setAddToWishlist(true);
        toast.success("Product added to Wishlist");
      }
    } catch (err) {
      toast.error("Unable to complete Request!!");
    }
  };

  const handleHide = () => {
    formHide(overlay, form);
    document.body.style.overflowY = "auto";
  };

  return (
    <>
      <Navbar />
      <div className="pdContainer">
        <Overlay className="reveal" overlayRef={overlay} formRef={form} />
        {product ? (
          <div className="pdContainer__main">
            <div className={"pdContainer__ratingModel"} ref={form}>
              <div className="pdContainer__ratingTop">
                <span>Leave a Rating</span>
                <IconButton onClick={handleHide}>
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
                <button onClick={handleHide}>Cancel</button>
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
                    {product.category && (
                      <li>
                        Category
                        <Link
                          className="pdContainer__infoLink"
                          to={`/category/${product.category.slug}`}
                        >
                          <span>{product.category.name}</span>
                        </Link>
                      </li>
                    )}
                    <li>
                      Sub Categories
                      {product.subs &&
                        product.subs.map((sub) => (
                          <Link
                            className="pdContainer__infoLink"
                            to={`/subcategory/${sub.slug}`}
                            key={sub._id}
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
                        {product.color &&
                          product.color.map((clr) => {
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
                  <button onClick={handleAddToWishlist}>
                    <FavoriteBorder className="icon" />
                    {addToWishlist ? "Added to Wishlist" : "Add to Wishlist"}
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
