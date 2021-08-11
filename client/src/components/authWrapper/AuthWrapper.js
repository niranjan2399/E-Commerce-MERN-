import React from "react";
import { Link, NavLink, useHistory } from "react-router-dom";
import "./authWrapper.scss";

function AuthWrapper({ children }) {
  const history = useHistory();
  const path = history.location.pathname;

  return (
    <div className="wrapperContainer">
      <NavLink to="/" className="wrapperContainer__logo">
        E.C
      </NavLink>
      <div className="wrapperContainer__mainDiv">
        {children}
        {path !== "/register/complete" &&
          (path === "/login" ? (
            <Link to="/register" className="wrapperContainer__bottomButton">
              Create new E.C account
            </Link>
          ) : (
            <Link to="/login" className="wrapperContainer__bottomButton">
              Already a user? Login
            </Link>
          ))}
      </div>
    </div>
  );
}

export default AuthWrapper;
