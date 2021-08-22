import React, { useEffect, useRef, useState } from "react";
import { Link, useHistory } from "react-router-dom";
import { toast } from "react-toastify";
import { removeProduct } from "../../utils/product";
import { useSelector, useDispatch } from "react-redux";
import { removeFromCart, handleAddToCart } from "../../utils/cart";
import "./productCard.scss";

function ProductCard({ product, setProducts = null }) {
  const path = useHistory().location.pathname;
  const { user, cart } = useSelector((state) => ({ ...state }));
  const [addedToCart, setAddedToCart] = useState(false);
  const dispatch = useDispatch();
  const colors = {
    Blue: "#6E8CD5",
    Red: "#F56060",
    Green: "#44C28D",
    Black: "#393c45",
    Silver: "#C0C0C0",
  };
  const front = useRef();
  const back = useRef();

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
    console.log("clicked");
  };

  const handleAdd = () => {
    handleAddToCart(product, dispatch);
  };

  const handleRemoveFromCart = () => {
    removeFromCart(product, dispatch);
  };

  return (
    <div className="product">
      <div className="product__make3D">
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
          {/* <div className="stats"> */}
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
                      to={`product/${product.slug}`}
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
          {/* </div> */}
        </div>

        <div className="product__back" ref={back}>
          <div className="shadow"></div>
          <div className="carousel">
            <ul className="carousel-container">
              <li>
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
              <div className="carouselPrev">
                <div className="y"></div>
                <div className="x"></div>
              </div>
              <div className="carouselNext">
                <div className="y"></div>
                <div className="x"></div>
              </div>
            </div>
          </div>
          <div className="flip-back">
            <div className="cy"></div>
            <div className="cx"></div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductCard;
