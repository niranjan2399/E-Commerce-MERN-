import React, { useEffect, useState } from "react";
import Navbar from "../../components/navbar/Navbar";
import axios from "../../axios";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import "./checkout.scss";
import { useHistory } from "react-router-dom";
import { CircularProgress } from "@material-ui/core";

const Checkout = () => {
  const [products, setProducts] = useState(null);
  const [total, setTotal] = useState(0);
  const [address, setAddress] = useState("");
  const [coupon, setCoupon] = useState("");
  const [addressSaved, setAddressSaved] = useState(false);
  const [totalAfterDiscount, setTotalAfterDiscount] = useState(null);
  const [discountError, setDiscountError] = useState(false);
  const { user } = useSelector((state) => ({ ...state }));
  const history = useHistory();
  const dispatch = useDispatch();

  useEffect(() => {
    user &&
      (async () => {
        const res = await axios.get("/user/cart", {
          headers: {
            authtoken: user.token,
          },
        });
        setProducts(res.data.products);
        setTotal(res.data.cartTotal);
      })();
  }, [user]);

  const emptyCart = async (req, res) => {
    if (typeof window !== undefined) {
      localStorage.removeItem("cart");
    }

    dispatch({
      type: "EMPTY_CART",
      payload: [],
    });

    try {
      await axios.delete("/user/cart", {
        headers: {
          authtoken: user.token,
        },
      });
      setProducts([]);
      setTotal(0);
      setDiscountError(false);
      setTotalAfterDiscount(null);
      toast.info("Cart is Empty!! Continue Shopping");

      history.push("/");
    } catch (err) {
      console.log(err);
      toast.error("Unable to complete request!!");
    }
  };

  const saveAddress = async () => {
    if (address !== "") {
      try {
        await axios.post(
          "/user/address",
          { address },
          {
            headers: {
              authtoken: user.token,
            },
          }
        );
        setAddressSaved(true);
        toast.success("Address saved successfully");
      } catch (err) {
        toast.error("Unable to Save address");
      }
    } else {
      toast.error("Address Cannot Be Empty!!");
    }
  };

  const handleCoupon = async () => {
    const res = await axios.post(
      "user/cart/coupon",
      { coupon },
      {
        headers: {
          authtoken: user.token,
        },
      }
    );
    if (res.data.err) {
      setDiscountError(true);
      dispatch({
        type: "COUPON_APPLIED",
        payload: false,
      });
    } else {
      setTotalAfterDiscount(res.data);
      dispatch({
        type: "COUPON_APPLIED",
        payload: true,
      });
      setCoupon("");
    }
  };

  return (
    <>
      <Navbar />
      <div className="checkout">
        <div className="checkout__left">
          <div className="checkout__leftTop">
            <h3>Delivery Address</h3>
            <ReactQuill
              theme="snow"
              value={address}
              onChange={(value) => setAddress(value)}
            />
            <div className="button">
              <button onClick={saveAddress}>Save</button>
            </div>
          </div>
          <div className="checkout__leftBottom">
            <h5>Got a Coupon?</h5>
            <div>
              <input
                type="text"
                {...(discountError
                  ? { style: { ...{ boxShadow: "0 0 1px 2px #c23616" } } }
                  : "")}
                placeholder="Coupon Code"
                value={coupon}
                onChange={(e) => {
                  setCoupon(e.target.value.toUpperCase());
                  setDiscountError(false);
                }}
              />
              <button onClick={handleCoupon}>Apply</button>
            </div>
          </div>
        </div>
        <div className="checkout__right">
          {products ? (
            <div style={{ width: "100%" }}>
              <h2>Order Summary</h2>
              <div className="checkout__totalProducts">
                <span>Total Products</span> {products.length}
              </div>
              {products.map((p, i) => {
                return (
                  <div className="checkout__details" key={i}>
                    <span>
                      {p.product.title + "(" + p.color + ") * " + p.count}
                    </span>
                    <span>
                      {(p.count * p.price).toLocaleString("en-US", {
                        style: "currency",
                        currency: "USD",
                      })}
                    </span>
                  </div>
                );
              })}
              <div className="checkout__details cart__total">
                <span>Cart Total</span>
                {total.toLocaleString("en-US", {
                  style: "currency",
                  currency: "USD",
                })}
              </div>
              {totalAfterDiscount && (
                <div className="checkout__details coupon__applied">
                  Coupon Applied: Total Payable:
                  <span>
                    {parseInt(totalAfterDiscount).toLocaleString("en-US", {
                      style: "currency",
                      currency: "USD",
                    })}
                  </span>
                </div>
              )}
              <div className="checkout__buttons">
                <button
                  disabled={!addressSaved}
                  onClick={() => history.push("/payment")}
                >
                  PLACE ORDER
                </button>
                {!addressSaved && <div>* address required</div>}
                <br />
                <button disabled={!products.length} onClick={emptyCart}>
                  EMPTY CART
                </button>
              </div>
            </div>
          ) : (
            <CircularProgress
              style={{ width: "2.5rem", height: "2.5rem", color: "#8167a9" }}
            />
          )}
        </div>
      </div>
    </>
  );
};

export default Checkout;
