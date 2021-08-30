import React, { useState } from "react";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import { changeStatus } from "../../utils/admin";
import CustomSelect from "../customSelect/CustomSelect";

const DashboardOrderCard = ({ order, orders, setOrders }) => {
  const [status, setStatus] = useState(order && order.orderStatus);
  const { user } = useSelector((state) => ({ ...state }));
  const colors = { SUCCEEDED: "#00b894", FAILED: "#e17055" };

  const handleStatusChange = async (e) => {
    setStatus(e.currentTarget.dataset.value);
    const res = await changeStatus(
      user.token,
      order._id,
      e.currentTarget.dataset.value
    );

    toast.success("Status Updated");
    setOrders([...orders.filter((oRd) => oRd._id !== order._id), res.data]);
  };

  return (
    <div className="dashboardContainer__orderCard">
      <div className="dashboardContainer__order">
        <div className="dashboardContainer__details">
          <div>
            <span>ORDER ID:</span> {order.paymentIntent.id}
          </div>
          <div>
            <span>
              AMOUNT:{" "}
              {(order.paymentIntent.amount / 100).toLocaleString("en-US", {
                style: "currency",
                currency: "USD",
              })}
            </span>
          </div>
        </div>
        <div className="dashboardContainer__details">
          <div>
            <span>CURRENCY: {order.paymentIntent.currency.toUpperCase()}</span>
          </div>
          <div>
            <span>PAYMENT:</span>
            <p
              style={{
                backgroundColor: `${
                  colors[order.paymentIntent.status.toUpperCase()]
                }`,
                display: "inline-block",
                paddingInline: ".5rem",
              }}
            >
              {order.paymentIntent.status.toUpperCase()}
            </p>
          </div>
        </div>
        <div className="dashboardContainer__details">
          <div>
            <span>
              ORDERED ON:{" "}
              {new Date(order.paymentIntent.created * 1000).toLocaleString()}
            </span>
          </div>
        </div>
      </div>
      <div className="dashboardContainer__select">
        <div className="select">
          <p className="label">DELIVERY STATUS:</p>
          <CustomSelect
            data-order_id={order._id}
            options={[
              {
                value: "Not Processed",
                name: "status",
              },
              {
                value: "Processing",
                name: "status",
              },
              {
                value: "Dispatched",
                name: "status",
              },
              {
                value: "Cancelled",
                name: "status",
              },
              {
                value: "Completed",
                name: "status",
              },
            ]}
            handleCustomSelect={handleStatusChange}
            value={status}
          />
          {/* <select
            id="status"
            defaultValue={order.orderStatus}
            onChange={(e) => handleStatusChange(order._id, e.target.value)}
          >
            <option value="Not Processed">Not Processed</option>
            <option value="Processing">Processing</option>
            <option value="Dispatched">Dispatched</option>
            <option value="Cancelled">Cancelled</option>
            <option value="Completed">Completed</option>
          </select> */}
        </div>
      </div>
    </div>
  );
};

export default DashboardOrderCard;
