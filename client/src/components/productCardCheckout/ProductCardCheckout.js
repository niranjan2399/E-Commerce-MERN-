import { IconButton } from "@material-ui/core";
import { Delete } from "@material-ui/icons";
import React, { useEffect, useState } from "react";
import ModalImage from "react-modal-image";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { removeFromCart } from "../../utils/cart";
import { getProduct } from "../../utils/product";
import "./productCardCheckout.scss";

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
    removeFromCart(product, user, dispatch);
  };

  return (
    <tbody>
      <tr>
        <td>
          <div style={{ width: "6.25rem", height: "auto" }}>
            <ModalImage
              small={product.images[0].url}
              large={product.images[0].url}
              hideZoom={true}
            />
          </div>
        </td>
        <td>{product.title}</td>
        <td>{product.price}</td>
        <td>{product.category.name}</td>
        <td>
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
        </td>
        <td>
          <input
            type="number"
            name="count"
            value={count}
            min={1}
            max={product.quantity}
            onChange={handleCount}
          />
        </td>
        <td>{product.shipping}</td>
        <td>
          <IconButton onClick={handleDelete}>
            <Delete />
          </IconButton>
        </td>
      </tr>
    </tbody>
  );
};

export default ProductCardCheckout;
