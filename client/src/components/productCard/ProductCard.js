import React, { useEffect, useRef, useState } from "react";
import { Link, useHistory } from "react-router-dom";
import { toast } from "react-toastify";
import { removeProduct } from "../../utils/product";
import { useSelector, useDispatch } from "react-redux";
import { ChevronLeft, ChevronRight, Close } from "@material-ui/icons";
import { handleAddToCart } from "../../utils/cart";
import "./productCard.scss";

function ProductCard({ product, setProducts = null, refCard }) {
  const path = useHistory().location.pathname;
  const { user, cart } = useSelector((state) => ({ ...state }));
  const [addedToCart, setAddedToCart] = useState(false);
  const [swiped, setSwiped] = useState(0);
  const dispatch = useDispatch();
  const colors = {
    Blue: "#6E8CD5",
    Red: "#F56060",
    Green: "#44C28D",
    Black: "#393c45",
    Silver: "#C0C0C0",
  };
  const container = useRef();
  const front = useRef();
  const back = useRef();
  const ul = useRef();

  useEffect(() => {
    cart &&
      setAddedToCart(cart.some((p) => p._id === product._id) ? true : false);
  }, [cart, product._id]);

  const deleteProduct = async (e) => {
    try {
      await removeProduct(e.target.dataset.slug, user.token);
      // TODO: delete images too!!
      setProducts((prod) => {
        return prod.filter((p) => p.slug !== e.target.dataset.slug);
      });
      toast.success("Product Successfully Deleted");
    } catch (err) {
      toast.error("Unable To Delete Product");
    }
  };

  const revealBack = () => {
    container.current.classList.add("back");

    setTimeout(() => {
      front.current.classList.add("hide");
      back.current.classList.add("reveal");
    }, 150);
  };

  const revealFront = () => {
    container.current.classList.remove("back");

    setTimeout(() => {
      front.current.classList.remove("hide");
      back.current.classList.remove("reveal");
    }, 150);
  };

  const handleAdd = () => {
    handleAddToCart(product, dispatch);
  };

  const handleRemoveFromCart = () => {
    let cart = [];

    if (typeof window !== "undefined") {
      if (localStorage.getItem("cart")) {
        cart = JSON.parse(localStorage.getItem("cart"));
      }

      cart = cart.filter((p) => {
        return p._id !== product._id;
      });

      localStorage.setItem("cart", JSON.stringify(cart));
      dispatch({
        type: "ADD_TO_CART",
        payload: cart,
      });
    }
  };

  const handleCarousel = (e) => {
    const carousel = ul.current;
    const widthCarousel = carousel.parentElement.offsetWidth;
    const position = e.currentTarget.dataset.position;
    if (position === "right") {
      carousel.style.transform =
        "translateX(-" + (swiped + 1) * widthCarousel + "px)";
      setSwiped((s) => s + 1);
    } else {
      carousel.style.transform =
        "translateX(-" + (swiped - 1) * widthCarousel + "px)";
      setSwiped((s) => s - 1);
    }
  };

  return (
    <div className="product" ref={refCard}>
      <div className="product__make3D" ref={container}>
        <div className="product__front" ref={front}>
          <div className="product__shadow"></div>
          <img src={product.images[0].url} alt="" />
          <div className="product__overlay"></div>
          {path !== "/admin/products" && (
            <div className="product__overlayButtons">
              {addedToCart ? (
                <button
                  className="product__button"
                  onClick={handleRemoveFromCart}
                >
                  Added
                </button>
              ) : (
                <button
                  className="product__button"
                  disabled={product.quantity < 1}
                  onClick={handleAdd}
                >
                  {product.quantity < 1 ? "Out of Stock" : "Add to Cart"}
                </button>
              )}
              <button className="product__button" onClick={revealBack}>
                View gallery
              </button>
            </div>
          )}
          <div
            className={
              "product__statsContainer" +
              (path === "/admin/products" ? "" : " product__statsBottom--home")
            }
          >
            <div className="product__statsTop">
              <span className="product_name">
                {product.title.slice(0, 17) +
                  (product.title.length > 17 ? "..." : "")}
              </span>
              {path !== "/admin/products" && (
                <span className="product_price">${product.price}</span>
              )}
            </div>
            <p>{product.description}</p>

            <div className="product__statsBottom">
              {path !== "/admin/products" ? (
                <>
                  <strong>SIZES</strong>
                  <span>{product.size.join(", ")}</span>
                  <strong>COLORS</strong>
                  <div className="product__colors">
                    <div className="product__colorsWrapper">
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
                    <Link
                      className="product__details"
                      to={`/product/${product.slug}`}
                    >
                      Details
                    </Link>
                  </div>
                </>
              ) : (
                <div className="product__adminOptions">
                  <Link
                    to={`products/update/${product.slug}`}
                    className="product__newLink"
                  >
                    <span>Update</span>
                  </Link>
                  <button
                    className="product__button"
                    data-slug={product.slug}
                    onClick={deleteProduct}
                  >
                    Delete
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="product__back" ref={back}>
          <div className="shadow"></div>
          <div className="carousel">
            <ul className="carousel__container" ref={ul}>
              <li className="selected">
                <img
                  src="https://s3-us-west-2.amazonaws.com/s.cdpn.io/245657/1.jpg"
                  alt=""
                />
              </li>
              <li>
                <img
                  src="https://s3-us-west-2.amazonaws.com/s.cdpn.io/245657/2.jpg"
                  alt=""
                />
              </li>
              <li>
                <img
                  src="https://s3-us-west-2.amazonaws.com/s.cdpn.io/245657/3.jpg"
                  alt=""
                />
              </li>
            </ul>
            <div className="arrows-perspective">
              <div
                className="carouselPrev"
                data-position="left"
                onClick={handleCarousel}
                {...(swiped === 0 ? { style: { display: "none" } } : {})}
              >
                <ChevronLeft
                  style={{ fontSize: "2.125rem", color: "#8167a9" }}
                />
              </div>
              <div
                className="carouselNext"
                data-position="right"
                onClick={handleCarousel}
                {...(swiped === product.images.length - 1
                  ? { style: { display: "none" } }
                  : {})}
              >
                <ChevronRight
                  style={{ fontSize: "2.125rem", color: "#8167a9" }}
                />
              </div>
            </div>
          </div>
          <div className="flip-back" onClick={revealFront}>
            <Close className="icon" />
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductCard;
