import React, { useEffect, useState } from "react";
import Navbar from "../../components/navbar/Navbar";
import { loadStripe } from "@stripe/stripe-js";
import {
  Elements,
  CardElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import { useSelector, useDispatch } from "react-redux";
import { CircularProgress } from "@material-ui/core";
import axios from "../../axios";
import "./stripe.css";
import "./payment.scss";
import { DoneOutline } from "@material-ui/icons";
import { Link } from "react-router-dom";

const promise = loadStripe(process.env.REACT_APP_STRIPE_KEY);

const Payment = () => {
  return (
    <>
      <Navbar />
      <div>
        <Elements stripe={promise}>
          <h2>Complete your purchase</h2>
          <StripeCheckout />
        </Elements>
      </div>
    </>
  );
};

const StripeCheckout = () => {
  const [suceeded, setSuceeded] = useState(false);
  const [error, setError] = useState(null);
  const [processing, setProcessing] = useState(false);
  const [disabled, setDisabled] = useState(true);
  const [clientSecret, setClientSecret] = useState("");

  const [cartTotal, setCartTotal] = useState(0);
  const [totalAfterDiscount, setTotalAfterDiscount] = useState(0);
  const [payable, setPayable] = useState(0);

  const stripe = useStripe();
  const elements = useElements();
  const dispatch = useDispatch();
  const { user, coupon } = useSelector((state) => ({ ...state }));

  useEffect(() => {
    (async () => {
      const res = await axios.post(
        "/create-payment-intent",
        { couponApplied: coupon },
        {
          headers: {
            authtoken: user.token,
          },
        }
      );

      setCartTotal(res.data.cartTotal);
      setTotalAfterDiscount(res.data.totalAfterDiscount);
      setPayable(res.data.payable);
      setClientSecret(res.data.clientSecret);
    })();
  }, [user.token, coupon]);

  const cardStyle = {
    base: {
      color: "#32325d",
      fontFamily: "Arial, sans-serif",
      fontSmoothing: "antialiased",
      fontSize: "16px",
      "::placeholder": {
        color: "#32325d",
      },
    },
    invalid: {
      fontFamily: "Arial, sans-serif",
      color: "#fa755a",
      iconColor: "#fa755a",
    },
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setProcessing(true);

    const payload = await stripe.confirmCardPayment(clientSecret, {
      payment_method: {
        card: elements.getElement(CardElement),
        billing_details: {
          name: e.target.name.value,
        },
      },
    });

    if (payload.error) {
      setError(`Payment failed! ${payload.error.message}`);
      setProcessing(false);
    } else {
      const res = await axios.post(
        "/user/order",
        { stripeResponse: payload },
        {
          headers: {
            authtoken: user.token,
          },
        }
      );

      if (res.data.ok) {
        if (typeof window !== "undefined") {
          localStorage.removeItem("cart");
          dispatch({
            type: "EMPTY_CART",
            payload: [],
          });
          dispatch({
            type: "COUPON_APPLIED",
            payload: false,
          });

          await axios.delete("/user/cart", {
            headers: {
              authtoken: user.token,
            },
          });
        }
      }

      setError(null);
      setProcessing(false);
      setSuceeded(true);
    }
  };

  const handleChange = (e) => {
    setDisabled(e.empty);
    setError(e.error ? e.error.message : "");
  };

  return (
    <>
      {!suceeded && totalAfterDiscount !== undefined ? (
        <p>Total after discount: ${totalAfterDiscount}</p>
      ) : (
        <p>No coupon applied</p>
      )}
      <div>
        <div>Total: ${cartTotal}</div>
        <div>Total Payable: ${totalAfterDiscount || cartTotal}</div>
      </div>
      <form onSubmit={handleSubmit}>
        <CardElement
          id="card-element"
          options={cardStyle}
          onChange={handleChange}
        />
        <button
          className="stripe-button"
          disabled={processing || disabled || suceeded}
          type="submit"
        >
          {processing ? (
            <div>
              <CircularProgress style={{ width: "1rem", height: "1rem" }} />
            </div>
          ) : suceeded ? (
            <DoneOutline style={{ fontSize: "1rem" }} />
          ) : (
            "Pay now"
          )}
        </button>
      </form>
      {error && <div>{error}</div>}
      {suceeded && (
        <div>
          Payment Successful.{" "}
          <Link to="/user/history">See it in your purchase history.</Link>
        </div>
      )}
    </>
  );
};

export default Payment;
