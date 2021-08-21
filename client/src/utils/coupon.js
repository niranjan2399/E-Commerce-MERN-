import axios from "../axios";

export const createCoupon = async (data, authtoken) => {
  return await axios.post("/coupon", data, {
    headers: {
      authtoken,
    },
  });
};

export const removeCoupon = async (couponId, authtoken) => {
  return await axios.delete(`/coupon/${couponId}`, {
    headers: {
      authtoken,
    },
  });
};

export const listCoupons = async () => {
  return await axios.get("/coupons");
};
