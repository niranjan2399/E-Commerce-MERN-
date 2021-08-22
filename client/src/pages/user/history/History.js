import React, { useEffect, useState } from "react";
import Navbar from "../../../components/navbar/Navbar";
import { useSelector } from "react-redux";
import UserSidebar from "../../../components/userSidebar/UserSidebar";
import axios from "../../../axios";
import "./history.scss";

function History() {
  const [orders, setOrders] = useState(null);
  const { user } = useSelector((state) => ({ ...state }));

  useEffect(() => {
    (async () => {
      const res = await axios.get("/user/orders", {
        headers: {
          authtoken: user.token,
        },
      });
      setOrders(res.data);
    })();
  }, [user]);

  return (
    <>
      <Navbar />
      <div className="historyContainer">
        {user && <UserSidebar />}
        <div className="historyContainer__main">
          {orders ? (
            <div>User purchase orders</div>
          ) : (
            <div>No purchase history</div>
          )}
          {orders &&
            orders.map((order) => {
              return (
                <div>
                  <div>
                    <span>Order Id: {order.paymentIntent.id}</span>
                    <span>
                      Amount:{" "}
                      {(order.paymentIntent.amount / 100).toLocaleString(
                        "en-US",
                        {
                          style: "currency",
                          currency: "USD",
                        }
                      )}
                    </span>
                    <span>
                      Ordered On:{" "}
                      {new Date(
                        order.paymentIntent.created * 1000
                      ).toLocaleString()}
                    </span>
                    <span>STATUS: {order.orderStatus}</span>
                  </div>
                  <div>
                    <table>
                      <thead>
                        <tr>
                          <th>Title</th>
                          <th>Price</th>
                          <th>Color</th>
                          <th>Quantity</th>
                          <th>Shipping</th>
                        </tr>
                      </thead>
                      {order.products.map((item) => {
                        return (
                          <tr>
                            <td>{item.product.title}</td>
                            <td>${item.product.price}</td>
                            <td>{item.color}</td>
                            <td>{item.count}</td>
                            <td>{item.product.shipping}</td>
                          </tr>
                        );
                      })}
                    </table>
                  </div>
                </div>
              );
            })}
        </div>
      </div>
    </>
  );
}

export default History;
