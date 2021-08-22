import axios from "../axios";

export const loadOrders = async (authtoken) => {
  return await axios.get("/admin/orders", {
    headers: {
      authtoken,
    },
  });
};

export const changeStatus = async (authtoken, orderId, orderStatus) => {
  return await axios.put(
    "/admin/order-status",
    { orderId, orderStatus },
    {
      headers: {
        authtoken,
      },
    }
  );
};
