import React from "react";
import { useSelector } from "react-redux";
import { Link, useHistory } from "react-router-dom";
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

  const saveOrderToDb = async () => {
    history.push({
      pathname: "/login",
      state: { from: "/cart" },
    });
  };

  const showCartItems = () => (
    <table>
      <thead>
        <tr>
          <th scope="col">Image</th>
          <th scope="col">Title</th>
          <th scope="col">Price</th>
          <th scope="col">Category</th>
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
  );
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
              <button disabled={!cart.length}>PROCEED TO CHECKOUT</button>
            ) : (
              <button onClick={saveOrderToDb} disabled={!cart.length}>
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
