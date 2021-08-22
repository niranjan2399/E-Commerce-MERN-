import React, { useEffect, useState } from "react";
import Navbar from "../../../components/navbar/Navbar";
import { useSelector } from "react-redux";
import UserSidebar from "../../../components/userSidebar/UserSidebar";
import { loadOrders, changeStatus } from "../../../utils/admin";
import "./dashboard.scss";
import AdminSidebar from "../../../components/adminSidebar/AdminSidebar";
import { toast } from "react-toastify";

function Dashboard() {
  const [orders, setOrders] = useState(null);
  const { user } = useSelector((state) => ({ ...state }));

  useEffect(() => {
    (async () => {
      const res = await loadOrders(user.token);
      setOrders(res.data);
    })();
  }, [user]);

  const handleStatusChange = async (orderId, orderStatus) => {
    const res = await changeStatus(user.token, orderId, orderStatus);

    toast.success("Status Updated");
    setOrders([...orders.filter((order) => order._id !== orderId), res.data]);
  };

  return (
    <>
      <Navbar />
      <div className="dashboardConatiner">
        {user && (user.role === "admin" ? <AdminSidebar /> : <UserSidebar />)}
        <div className="dashboardContainer__right">
          <div>Admin Dashboard</div>
          <div>
            {orders &&
              orders.map((order, i) => {
                return (
                  <div key={i}>
                    <div>
                      <span>ORDER ID: {order.paymentIntent.id}</span>
                    </div>
                    <div>
                      <span>
                        AMOUNT:{" "}
                        {(order.paymentIntent.amount / 100).toLocaleString(
                          "en-US",
                          {
                            style: "currency",
                            currency: "USD",
                          }
                        )}
                      </span>
                    </div>
                    <div>
                      <span>
                        CURRENCY: {order.paymentIntent.currency.toUpperCase()}
                      </span>
                    </div>
                    <div>
                      <span>
                        PAYMENT: {order.paymentIntent.status.toUpperCase()}
                      </span>
                    </div>
                    <div>
                      <span>
                        ORDERED ON:{" "}
                        {new Date(
                          order.paymentIntent.created * 1000
                        ).toLocaleString()}
                      </span>
                    </div>
                    <div>
                      <div>
                        <label htmlFor="status">DELIVERY STATUS</label>
                        <select
                          name="status"
                          defaultValue={order.orderStatus}
                          onChange={(e) =>
                            handleStatusChange(order._id, e.target.value)
                          }
                        >
                          <option value="Not Processed">Not Processed</option>
                          <option value="Processing">Processing</option>
                          <option value="Dispatched">Dispatched</option>
                          <option value="Cancelled">Cancelled</option>
                          <option value="Completed">Completed</option>
                        </select>
                      </div>
                    </div>
                  </div>
                );
              })}
          </div>
        </div>
      </div>
    </>
  );
}

export default Dashboard;
