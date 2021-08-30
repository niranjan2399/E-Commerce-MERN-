import React, { useEffect, useState } from "react";
import Navbar from "../../../components/navbar/Navbar";
import { useSelector } from "react-redux";
import { loadOrders } from "../../../utils/admin";
import "./dashboard.scss";
import AdminSidebar from "../../../components/adminSidebar/AdminSidebar";
import { CircularProgress } from "@material-ui/core";
import DashboardOrderCard from "../../../components/dashboardOrderCard/DashboardOrderCard";

function Dashboard() {
  const [orders, setOrders] = useState(null);
  const { user } = useSelector((state) => ({ ...state }));

  useEffect(() => {
    (async () => {
      const res = await loadOrders(user.token);
      setOrders(res.data);
    })();

    return () => {
      setOrders(null);
    };
  }, [user]);

  return (
    <>
      <Navbar />
      <div className="dashboardConatiner">
        <AdminSidebar />
        <div className="dashboardContainer__right">
          <div className="dashboardContainer__top">
            <h2>Admin Dashboard</h2>
          </div>
          {orders ? (
            orders.map((order, i) => {
              return (
                <DashboardOrderCard
                  key={i}
                  order={order}
                  orders={orders}
                  setOrders={setOrders}
                />
              );
            })
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

export default Dashboard;
