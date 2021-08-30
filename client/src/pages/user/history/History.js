import React, { useEffect, useState } from "react";
import Navbar from "../../../components/navbar/Navbar";
import { useSelector } from "react-redux";
import UserSidebar from "../../../components/userSidebar/UserSidebar";
import axios from "../../../axios";
import WarningDiv from "../../../components/warning/WarningDiv";
import "./history.scss";
import { Link } from "react-router-dom";
import { CircularProgress } from "@material-ui/core";

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

  const colors = {
    "Not Processed": "#fdcb6e",
    Processing: "#fdcb6e",
    Dispatched: "#55efc4",
    Cancelled: "#e17055",
    Completed: "#00b894",
  };

  return (
    <>
      <Navbar />
      <div className="historyContainer">
        {user && <UserSidebar />}
        <div className="historyContainer__main">
          <div className="historyContainer__top">
            <h2>User purchase orders</h2>
          </div>
          {orders ? (
            orders.length ? (
              orders.map((order, j) => {
                return (
                  <div key={j} className="historyContainer__orderCard">
                    <div className="historyContainer__orderTop">
                      <div className="historyContainer__details">
                        <div>
                          <span>Order Id: </span>
                          {order.paymentIntent.id}
                        </div>
                        <div>
                          <span>Amount:</span>
                          {"  "}
                          {(order.paymentIntent.amount / 100).toLocaleString(
                            "en-US",
                            {
                              style: "currency",
                              currency: "USD",
                            }
                          )}
                        </div>
                      </div>
                      <div className="historyContainer__details">
                        <div>
                          <span>Ordered On:</span>
                          {"  "}
                          {new Date(
                            order.paymentIntent.created * 1000
                          ).toLocaleString()}
                        </div>
                        <div>
                          <span>STATUS: </span>
                          <p
                            style={{
                              backgroundColor: `${colors[order.orderStatus]}`,
                              display: "inline-block",
                              paddingInline: ".5rem",
                            }}
                          >
                            {order.orderStatus}
                          </p>
                        </div>
                      </div>
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
                        {order.products.map((item, i) => {
                          return (
                            <tbody key={i}>
                              <tr>
                                <td>
                                  <Link to={`/product/${item.product.slug}`}>
                                    {item.product.title}
                                  </Link>
                                </td>
                                <td>${item.product.price}</td>
                                <td>{item.color}</td>
                                <td>{item.count}</td>
                                <td>{item.product.shipping}</td>
                              </tr>
                            </tbody>
                          );
                        })}
                      </table>
                    </div>
                  </div>
                );
              })
            ) : (
              <div>
                <WarningDiv message="No purchase history" />
              </div>
            )
          ) : (
            <div className="progress">
              <CircularProgress
                style={{ width: "2rem", height: "2rem", color: "#8167a9" }}
              />
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default History;
