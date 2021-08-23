import { IconButton } from "@material-ui/core";
import { Delete } from "@material-ui/icons";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useHistory } from "react-router-dom";
import { toast } from "react-toastify";
import { removeFromCart } from "../../utils/cart";
import { getProduct } from "../../utils/product";

const ProductCardCheckout = ({ product }) => {
  const [color, setColor] = useState(product.color ? product.color : "");
  const [count, setCount] = useState(product.count);
  const [colors, setColors] = useState();
  const { user } = useSelector((state) => ({ ...state }));
  const dispatch = useDispatch();

  useEffect(() => {
    (async () => {
      const res = await getProduct(product.slug);
      setColors(res.data.color);
    })();
  }, [product.slug]);

  const handleColorChange = (e) => {
    setColor(e.target.value);
    let cart = [];

    if (typeof window !== "undefined") {
      if (localStorage.getItem("cart")) {
        cart = JSON.parse(localStorage.getItem("cart"));
      }

      cart.forEach((p) => {
        if (p._id === product._id) {
          p.color = e.target.value;
        }
      });

      localStorage.setItem("cart", JSON.stringify(cart));
      dispatch({
        type: "ADD_TO_CART",
        payload: cart,
      });
    }
  };

  const handleCount = (e) => {
    setCount(e.target.value);

    if (parseInt(e.target.value) === product.quantity) {
      toast.error("Max Quantity Reached!!");
    }

    let cart = [];

    if (typeof window !== "undefined") {
      if (localStorage.getItem("cart")) {
        cart = JSON.parse(localStorage.getItem("cart"));
      }

      cart.forEach((p) => {
        if (p._id === product._id) {
          p.count = e.target.value;
        }
      });

      localStorage.setItem("cart", JSON.stringify(cart));
      dispatch({
        type: "ADD_TO_CART",
        payload: cart,
      });
    }
  };

  const handleDelete = () => {
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

  return (
    <div className="pcCheckout">
      <Link to={`/product/${product.slug}`}>
        <div className="modal">
          <img src={product.images[0].url} alt="" />
        </div>
      </Link>
      <div className="pcCheckout__container">
        <div className="pcCheckout__Title">
          <Link
            style={{
              textDecoration: "none",
              color: "black",
              fontWeight: "500",
            }}
            to={`/product/${product.slug}`}
          >
            {product.title.slice(0, 20) +
              (product.title.length > 20 ? "..." : "")}
          </Link>
          <div className="pcCheckout__delete" onClick={handleDelete}>
            <Delete className="icon" />
          </div>
        </div>
        <span className="price">${product.price}</span>
        <div className="pcCheckout__details">
          <div className="pcCheckout__detail"></div>
          <div className="pcCheckout__detail">
            <span
              style={{ fontWeight: "500", fontSize: ".8rem", color: "#2C3A47" }}
            >
              <label htmlFor="color">Color: </label>
            </span>
            <div>
              <select name="color" value={color} onChange={handleColorChange}>
                {product.color ? (
                  <option value={product.color}>{product.color}</option>
                ) : (
                  <option value="" hidden>
                    Select Color
                  </option>
                )}
                {colors &&
                  colors
                    .filter((color) => color !== product.color)
                    .map((color, i) => {
                      return (
                        <option key={i} value={color}>
                          {color}
                        </option>
                      );
                    })}
              </select>
            </div>
          </div>
          <div className="pcCheckout__detail">
            <span
              style={{ fontWeight: "500", fontSize: ".8rem", color: "#2C3A47" }}
            >
              <label htmlFor="count">Quantity: </label>
            </span>
            <div>
              <input
                type="number"
                name="count"
                value={count}
                min={1}
                max={product.quantity}
                onChange={handleCount}
              />
            </div>
          </div>
          <div className="pcCheckout__detail">
            <span
              style={{ fontWeight: "500", fontSize: ".8rem", color: "#2C3A47" }}
            >
              Shipping:{" "}
            </span>
            <span>{product.shipping}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCardCheckout;
