import axios from "../axios";

export const createUserOrUpdate = async (authToken, data) => {
  return await axios.post("/auth/create-or-update-user", data, {
    headers: {
      authtoken: authToken,
    },
  });
};

export const currentUser = async (authToken) => {
  return await axios.post(
    "/auth/current-user",
    {},
    {
      headers: {
        authtoken: authToken,
      },
    }
  );
};

export const currentAdmin = async (authToken) => {
  return await axios.post(
    "/auth/current-admin",
    {},
    { headers: { authtoken: authToken } }
  );
};
