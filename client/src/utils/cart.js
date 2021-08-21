import _ from "lodash";
import axios from "../axios";
import { toast } from "react-toastify";

export const removeFromCart = async (product, user, dispatch) => {
  try {
    let cart = [];

    if (typeof window !== "undefined") {
      if (localStorage.getItem("cart")) {
        cart = JSON.parse(localStorage.getItem("cart"));
      }

      cart = cart.filter((p) => {
        return p._id !== product._id;
      });

      await axios.post("/user/cart", cart, {
        headers: {
          authtoken: user.token,
        },
      });

      localStorage.setItem("cart", JSON.stringify(cart));
      dispatch({
        type: "ADD_TO_CART",
        payload: cart,
      });
    }
  } catch (err) {
    toast.error("Can't Delete Product");
  }
};

export const handleAddToCart = (product, dispatch) => {
  // cart array
  let cart = [];
  if (typeof window !== "undefined") {
    if (localStorage.getItem("cart")) {
      cart = JSON.parse(localStorage.getItem("cart"));
    }
    cart.push({ ...product, count: 1, color: null });

    let unique = _.uniqWith(cart, _.isEqual);
    localStorage.setItem("cart", JSON.stringify(unique));

    dispatch({
      type: "ADD_TO_CART",
      payload: cart,
    });
  }
};
