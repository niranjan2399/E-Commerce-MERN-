import React, { useEffect, useState } from "react";
import Navbar from "../../components/navbar/Navbar";
import axios from "../../axios";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import "./checkout.scss";
import { useHistory } from "react-router-dom";

const Checkout = () => {
  const [products, setProducts] = useState(null);
  const [total, setTotal] = useState(0);
  const [address, setAddress] = useState("");
  const [coupon, setCoupon] = useState("");
  const [addressSaved, setAddressSaved] = useState(false);
  const [totalAfterDiscount, setTotalAfterDiscount] = useState(null);
  const [discountError, setDiscountError] = useState(false);
  const { user } = useSelector((state) => ({ ...state }));
  const history = useHistory()
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
    } catch (err) {
      console.log(err);
      toast.error("Unable to complete request!!");
    }
  };

  const saveAddress = async () => {
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
            <button onClick={saveAddress}>Save</button>
          </div>
          <div className="checkout__leftBottom">
            <h5>Got a Coupon?</h5>
            <input
              type="text"
              placeholder="Coupon Code"
              value={coupon}
              onChange={(e) => {
                setCoupon(e.target.value.toUpperCase());
                setDiscountError(false);
              }}
            />
            <button onClick={handleCoupon}>Apply</button>
            {discountError && (
              <span className="couponError">Invalid Coupon</span>
            )}
          </div>
        </div>
        <div className="checkout__right">
          {products && (
            <>
              <h2>Order Summary</h2>
              <hr />
              <p>Total Products {products.length}</p>
              <hr />
              {products.map((p, i) => {
                return (
                  <div key={i}>
                    {p.product.title +
                      "(" +
                      p.color +
                      ") * " +
                      p.count +
                      " = " +
                      p.count * p.price}
                  </div>
                );
              })}
              <hr />
              <p>Cart Total: ${total}</p>
              {totalAfterDiscount && (
                <div>Coupon Applied: Total Payable: ${totalAfterDiscount} </div>
              )}
              <div>
                <button
                  disabled={!addressSaved}
                  onClick={() => history.push("/payment")}
                >
                  PLACE ORDER
                </button>
                <br />
                <button disabled={!products.length} onClick={emptyCart}>
                  EMPTY CART
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default Checkout;
