import axios from "../axios";

export const getCategories = async () => {
  return await axios.get("/category");
};

export const getCategory = async (slug) => {
  return await axios.get(`/category/${slug}`);
};

export const removeCategory = async (slug, authtoken) => {
  return await axios.delete(`/category/${slug}`, {
    headers: {
      authtoken,
    },
  });
};

export const updateCategory = async (slug, authtoken, data) => {
  return await axios.put(`/category/${slug}`, data, {
    headers: {
      authtoken,
    },
  });
};

export const createCategory = async (authtoken, data) => {
  return await axios.post("/category", data, {
    headers: {
      authtoken,
    },
  });
};
