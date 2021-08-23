import axios from "../../axios";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link, useHistory } from "react-router-dom";
import { toast } from "react-toastify";
import Navbar from "../../components/navbar/Navbar";
import { CircularProgress } from "@material-ui/core";
import ProductCardCheckout from "../../components/productCardCheckout/ProductCardCheckout";
import "./cart.scss";
import { ArrowDownwardOutlined } from "@material-ui/icons";

const Cart = () => {
  const [coupons, setCoupons] = useState(null);
  const [copied, setCopied] = useState([]);
  const { user, cart } = useSelector((state) => ({ ...state }));
  const history = useHistory();

  useEffect(() => {
    (async () => {
      const res = await axios.get("/coupons");
      setCoupons(res.data);
    })();
  }, []);

  const product = () => {
    let total = 0;
    total =
      cart.length > 0
        ? cart.reduce((p1, p2) => {
            return p1 + p2.price * p2.count;
          }, 0)
        : 0;

    return total;
  };

  const handleLogin = async () => {
    history.push({
      pathname: "/login",
      state: { from: "/cart" },
    });
  };

  const showCartItems = () => (
    <>
      <h3>Shopping Cart</h3>
      <div className="cartContainer__products">
        {cart.map((product) => (
          <ProductCardCheckout key={product._id} product={product} />
        ))}
      </div>
    </>
  );

  const handleCheckout = async () => {
    const productWithoutColor = cart.filter((prod) => prod.color === null);
    if (productWithoutColor.length) {
      return toast.error("Could Not Find Color For A Product");
    } else {
      try {
        const res = await axios.post("/user/cart", cart, {
          headers: {
            authtoken: user.token,
          },
        });
        if (res.data.ok) history.push("/checkout");
      } catch (err) {
        toast.error("Cannot connect to DB!!");
      }
    }
  };

  const handleCopyCoupon = (e) => {
    const couponName = e.target.dataset.coupon;

    navigator.clipboard.writeText(couponName);
    setCopied([...copied, couponName]);
  };

  return (
    <>
      <Navbar />
      {cart.length ? (
        <div className="cartContainer">
          <div
            className="cartContainer__bottomArrowFloat"
            onClick={() =>
              window.scroll({
                left: 0,
                top: document.body.scrollHeight,
                behavior: "smooth",
              })
            }
          >
            <ArrowDownwardOutlined className="icon" />
          </div>
          <div className="cartContainer__left">{showCartItems()}</div>
          {cart.length && (
            <div className="cartContainer__right">
              <div className="cartContainer__coupon">
                <h3>Coupons</h3>
                <div className="couponContainer">
                  {coupons ? (
                    coupons.map((coupon) => {
                      return (
                        <div
                          key={coupon._id}
                          className="couponContainer__wrapper"
                        >
                          <div className="couponContainer__left">
                            <p className="couponContainer__name">
                              {coupon.name}
                            </p>
                            <div className="couponContainer__discount">
                              <span
                                style={{
                                  fontWeight: "500",
                                  marginRight: ".5rem",
                                }}
                              >
                                Discount
                              </span>
                              <span>{coupon.discount}%</span>
                            </div>
                          </div>
                          <div className="couponContainer__button">
                            <button
                              data-coupon={coupon.name}
                              onClick={handleCopyCoupon}
                            >
                              {copied.some((text) => text === coupon.name)
                                ? "COPIED"
                                : "COPY"}
                            </button>
                          </div>
                        </div>
                      );
                    })
                  ) : (
                    <div style={{ width: "100%", textAlign: "center" }}>
                      <CircularProgress
                        style={{
                          width: "1.5rem",
                          color: "#8167a9",
                          height: "1.5rem",
                        }}
                      />
                    </div>
                  )}
                </div>
              </div>
              <div className="cartContainer__summary">
                <h3>Order Summary</h3>
                <div className="cartContainer__productPrice">
                  {cart.map((product) => {
                    return (
                      <div key={product._id}>
                        <span>{product.title + " * " + product.count}</span>
                        <span>
                          {" = " +
                            (product.price * product.count).toLocaleString(
                              "en-US",
                              {
                                style: "currency",
                                currency: "USD",
                              }
                            )}
                        </span>
                      </div>
                    );
                  })}
                </div>
                <hr />
                <div className="cartContainer__rightMid">
                  <div>
                    <span>
                      Subtotal(
                      {cart.length === 1 ? "1 item" : `${cart.length} items`})
                    </span>
                    <span>
                      {"= " +
                        product().toLocaleString("en-US", {
                          style: "currency",
                          currency: "USD",
                        })}
                    </span>
                  </div>
                </div>
                <hr />
                <div className="cartContainer__rightBottom">
                  {user && user ? (
                    <button disabled={!cart.length} onClick={handleCheckout}>
                      PROCEED TO CHECKOUT
                    </button>
                  ) : (
                    <button onClick={handleLogin} disabled={!cart.length}>
                      LOGIN TO CHECKOUT
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="noProducts">
          No products in cart. <Link to="/">Continue Shopping</Link>
        </div>
      )}
    </>
  );
};

export default Cart;
