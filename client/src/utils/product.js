import axios from "../axios";

export const createProduct = async (product, authtoken) => {
  return axios.post("/product", product, {
    headers: {
      authtoken,
    },
  });
};

export const getProduct = async (product) => {};

export const removeProduct = async (slug, authtoken) => {
  return await axios.delete(`/product/${slug}`, {
    headers: {
      authtoken,
    },
  });
};

export const listProducts = async (count) => {
  return await axios.get(`/product/${count}`);
};
