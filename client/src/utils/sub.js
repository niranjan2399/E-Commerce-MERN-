import axios from "../axios";

export const getSubs = async () => {
  return await axios.get("/sub");
};

export const getSub = async (slug, authtoken) => {
  return await axios.get(`/sub/${slug}`, {
    headers: {
      authtoken,
    },
  });
};

export const removeSub = async (slug, authtoken) => {
  return await axios.delete(`/sub/${slug}`, {
    headers: {
      authtoken,
    },
  });
};

export const updateSub = async (slug, authtoken, data) => {
  return await axios.put(`/sub/${slug}`, data, {
    headers: {
      authtoken,
    },
  });
};

export const createSub = async (authtoken, data) => {
  return await axios.post("/sub", data, {
    headers: {
      authtoken,
    },
  });
};

export const getForCategory = async (id) => {
  return await axios.get(`/sub/category/${id}`);
};
