import axios from "../axios";

export const createProduct = async (product, authtoken) => {
  return axios.post("/product", product, {
    headers: {
      authtoken,
    },
  });
};

export const getProduct = async (slug) => {
  return await axios.get(`/product/update/${slug}`);
};

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

export const updateProduct = async (slug, product, authtoken) => {
  return await axios.put(`/product/${slug}`, product, {
    headers: {
      authtoken,
    },
  });
};

export const getAccordingly = async (sort, order, limit) => {
  return await axios.post("/products", { sort, order, limit });
};

export const getTotalProducts = async () => {
  return await axios.get("/products/total");
};
