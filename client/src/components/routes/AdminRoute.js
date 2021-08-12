import React, { useEffect, useState } from "react";
import { Route } from "react-router-dom";
import { useSelector } from "react-redux";
import { currentAdmin } from "../../utils/auth";
import LoadingToRedirect from "../loadingToRedirect/LoadingToRedirect";

const AdminRoute = ({ component: Component, ...rest }) => {
  const { user } = useSelector((state) => ({ ...state }));
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    if (user) {
      const isAdmin = async () => {
        try {
          await currentAdmin(user.token);
          setIsAdmin(true);
        } catch (err) {
          console.log(err);
          setIsAdmin(false);
        }
      };
      isAdmin();
    }
  }, [user]);

  return isAdmin ? (
    <Route {...rest} render={(props) => <Component {...props} />} />
  ) : (
    <LoadingToRedirect />
  );
};

export default AdminRoute;
