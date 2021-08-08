import React, { useState } from "react";
import "./navbar.scss";
import { NavLink, useHistory } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import firebase from "firebase";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faSearch,
  faUser,
  faShoppingCart,
  faUserPlus,
  faSignOutAlt,
} from "@fortawesome/free-solid-svg-icons";

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
          <FontAwesomeIcon icon={faSearch} className="search__icon" />
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
                <FontAwesomeIcon
                  icon={faUser}
                  style={{ marginRight: ".5rem" }}
                />
                Login
              </NavLink>
              <NavLink
                to="/register"
                exact
                activeClassName="select_active"
                className="navContainer__opt"
                onClick={() => setSelect("register")}
              >
                <FontAwesomeIcon
                  icon={faUserPlus}
                  style={{ marginRight: ".5rem" }}
                />
                Register
              </NavLink>
            </div>
          </div>
        ) : (
          <div className="navContainer__options">
            <span>Hello, Niranjan</span>
            <div className="navContainer__selector">
              <div className="navContainer__opt"></div>
              <div className="navContainer__opt" onClick={handleLogout}>
                <FontAwesomeIcon
                  icon={faSignOutAlt}
                  style={{ marginRight: ".5rem" }}
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
          className="navContainer__link"
        >
          <FontAwesomeIcon icon={faShoppingCart} />
        </NavLink>
      </div>
    </div>
  );
}

export default Navbar;
