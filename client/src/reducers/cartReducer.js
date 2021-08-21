let initialState = [];

// load cart from localStorage
if (typeof window !== "undefined") {
  if (localStorage.getItem("cart")) {
    initialState = JSON.parse(localStorage.getItem("cart"));
  }
}

export const cartReducer = (state = initialState, action) => {
  switch (action.type) {
    case "ADD_TO_CART":
      return action.payload;
    case "EMPTY_CART":
      return action.payload;

    default:
      return state;
  }
};
