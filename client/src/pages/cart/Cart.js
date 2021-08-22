import axios from "../../axios";
import React from "react";
import { useSelector } from "react-redux";
import { Link, useHistory } from "react-router-dom";
import { toast } from "react-toastify";
import Navbar from "../../components/navbar/Navbar";
import ProductCardCheckout from "../../components/productCardCheckout/ProductCardCheckout";
import "./cart.scss";

const Cart = () => {
  const { user, cart } = useSelector((state) => ({ ...state }));
  const history = useHistory();

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
      <h3>Products ({cart.length})</h3>
      <table>
        <thead>
          <tr>
            <th scope="col">Image</th>
            <th scope="col">Title</th>
            <th scope="col">Price</th>
            <th scope="col">Color</th>
            <th scope="col">Count</th>
            <th scope="col">Shipping</th>
            <th scope="col">Remove</th>
          </tr>
        </thead>
        {cart.map((product) => (
          <ProductCardCheckout key={product._id} product={product} />
        ))}
      </table>
    </>
  );

  const handleCheckout = async () => {
    const productWithoutColor = cart.filter((prod) => prod.color === null);
    if (productWithoutColor.length) {
      return toast.error("Color not selected for a product");
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

  return (
    <>
      <Navbar />
      <div className="cartContainer">
        <div className="cartContainer__left">
          {cart.length ? (
            showCartItems()
          ) : (
            <>
              No products in cart. <Link to="/">Continue Shopping</Link>
            </>
          )}
        </div>
        <div className="cartContainer__right">
          <h3>Order Summary</h3>
          <hr />
          <span>Products</span>
          {cart.map((product) => {
            return (
              <span key={product._id}>
                {product.title +
                  " * " +
                  product.count +
                  " = $" +
                  product.price * product.count}
              </span>
            );
          })}
          <hr />
          <div className="cartContainer__rightMid">
            <span>Total = ${product()}</span>
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
    </>
  );
};

export default Cart;
