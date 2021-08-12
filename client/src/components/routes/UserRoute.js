import React from "react";
import { useSelector } from "react-redux";
import { Route } from "react-router-dom";
import LoadingToRedirect from "../loadingToRedirect/LoadingToRedirect";

function UserRoute({ component: Component, ...rest }) {
  const { user } = useSelector((state) => ({ ...state }));

  return user ? (
    <Route {...rest} render={(props) => <Component {...props} />} />
  ) : (
    <LoadingToRedirect />
  );
}

export default UserRoute;
