import React, { useState } from "react";
import "./navbar.scss";
import { NavLink, useHistory } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import firebase from "firebase";
import { IconButton, Badge } from "@material-ui/core";
import {
  ShoppingCart,
  Search,
  Person,
  PersonAdd,
  Dashboard,
} from "@material-ui/icons";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSignOutAlt } from "@fortawesome/free-solid-svg-icons";

function Navbar() {
  const [select, setSelect] = useState("login");
  const history = useHistory();
  const dispatch = useDispatch();
  // const state = useSelector((state) => state);
  const { user } = useSelector((state) => ({ ...state }));

  const handleLogout = () => {
    firebase.auth().signOut();

    dispatch({
      type: "LOGOUT",
      payload: null,
    });

    history.push("/login");
  };

  return (
    <div className="navContainer">
      <div className="navContainer__left">
        <NavLink
          to="/"
          exact
          activeStyle={{ color: "#777" }}
          className="navContainer__logo"
        >
          E.C
        </NavLink>
        <NavLink
          to="/shop"
          exact
          activeClassName="active"
          className="navContainer__link"
        >
          <span>Shop</span>
        </NavLink>
        <div className="navContainer__search">
          <input type="text" placeholder="Search" />
          <Search className="search__icon" />
        </div>
      </div>
      <div className="navContainer__right">
        {!user ? (
          <div className="navContainer__options">
            <span>{select}</span>
            <div className="navContainer__selector">
              <NavLink
                to="/login"
                exact
                activeClassName="select_active"
                className="navContainer__opt"
                onClick={() => setSelect("login")}
              >
                <Person className="navContainer__icon" />
                Login
              </NavLink>
              <NavLink
                to="/register"
                exact
                activeClassName="select_active"
                className="navContainer__opt"
                onClick={() => setSelect("register")}
              >
                <PersonAdd className="navContainer__icon" />
                Register
              </NavLink>
            </div>
          </div>
        ) : (
          <div className="navContainer__options">
            <span>Hello, {user.name.split(" ")[0]}</span>
            <div className="navContainer__selector">
              <div className="navContainer__opt">
                <Dashboard className="navContainer__icon" />
                Dashboard
              </div>
              <div className="navContainer__opt" onClick={handleLogout}>
                <FontAwesomeIcon
                  className="navContainer__icon"
                  icon={faSignOutAlt}
                />
                Logout
              </div>
            </div>
          </div>
        )}
        <NavLink
          to="/cart"
          exact
          activeClassName="active"
          className="navContainer__cart"
        >
          <IconButton
            style={{
              width: "2.5rem",
              height: "2.5rem",
              transition: "all 200ms linear",
            }}
          >
            <Badge badgeContent={1} color="secondary" max={5}>
              <ShoppingCart />
            </Badge>
          </IconButton>
        </NavLink>
      </div>
    </div>
  );
}

export default Navbar;
