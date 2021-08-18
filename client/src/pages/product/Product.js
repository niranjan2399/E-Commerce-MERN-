import React, { useState, useEffect } from "react";
import { useParams, useHistory } from "react-router-dom";
import { useSelector } from "react-redux";
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
import { getProduct } from "../../utils/product";
import "./product.scss";

function Product() {
  const [product, setProduct] = useState(null);
  const [value, setValue] = useState(2);
  const [hover, setHover] = useState(-1);
  const [showModel, setShowModel] = useState(false);
  const { user } = useSelector((state) => ({ ...state }));
  const slug = useParams().slug;
  const history = useHistory();

  useEffect(() => {
    (async () => {
      const res = await getProduct(slug);
      setProduct(res.data);
    })();
  }, [slug]);

  const colors = {
    Blue: "#6E8CD5",
    Red: "#F56060",
    Green: "#44C28D",
    Black: "#393c45",
    Silver: "#C0C0C0",
  };

  const labels = {
    0.5: "Useless",
    1: "Useless+",
    1.5: "Poor",
    2: "Poor+",
    2.5: "Ok",
    3: "Ok+",
    3.5: "Good",
    4: "Good+",
    4.5: "Excellent",
    5: "Excellent+",
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

  const handleRating = () => {
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
                  onChangeActive={(event, newHover) => {
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
                <button>Submit</button>
              </div>
            </div>
            <div className="pdContainer__carousel">
              {product && <ImageCarousel images={data} />}
            </div>
            <div className="pdContainer__detailContainer">
              <div className="pdContainer__title">{product.title}</div>
              <div className="pdContainer__details">
                <div className="pdContainer__detailsLeft">
                  <Tabs product={product} />
                  <ul className="pdContainer__info">
                    <li>
                      Price<span>${product.price}</span>
                    </li>
                    <li>
                      Category<span>{product.category.name}</span>
                    </li>
                    <li>
                      Sub Categories
                      {product.subs.map((sub) => (
                        <span key={sub._id}>{sub.name}</span>
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
                  <button>
                    <ShoppingCartOutlined className="icon" />
                    Add to Cart
                  </button>
                  <button onClick={handleRating}>
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
      </div>
    </>
  );
}

export default Product;
