import axios from "../axios";

export const createUser = async (authToken, data) => {
  return await axios.post("/create-user", data, {
    headers: {
      authtoken: authToken,
    },
  });
};
