import axios from "../axios";

export const createProduct = (product, authtoken) => {
  return axios.post("/product", product, {
    headers: {
      authtoken,
    },
  });
};

export const getProduct = (product) => {
  
}